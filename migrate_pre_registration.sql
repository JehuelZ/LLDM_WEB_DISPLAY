-- =============================================
-- MIGRACIÓN: Actualizar tabla profiles para soportar pre-registro
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- 1. Agregar columna auth_user_id (referencia al usuario autenticado)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users ON DELETE SET NULL UNIQUE;

-- 2. Agregar columna is_pre_registered (para distinguir miembros pre-registrados)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_pre_registered BOOLEAN DEFAULT FALSE;

-- 2.b Renombrar 'group' a 'member_group' si existe
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'group') THEN
    ALTER TABLE profiles RENAME COLUMN "group" TO member_group;
  END IF;
END $$;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS member_group TEXT;

-- 3. Vincular perfiles existentes a sus usuarios de auth
-- (Los perfiles existentes ya tienen el id = auth.users.id)
UPDATE profiles SET auth_user_id = id WHERE auth_user_id IS NULL;

-- 4. Los perfiles existentes NO son pre-registrados
UPDATE profiles SET is_pre_registered = FALSE WHERE is_pre_registered IS NULL;

-- 5. Actualizar el trigger para manejar pre-registros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_profile_id UUID;
BEGIN
  -- Buscar si existe un perfil pre-registrado con este email
  SELECT id INTO existing_profile_id
  FROM public.profiles
  WHERE email = NEW.email AND is_pre_registered = TRUE AND auth_user_id IS NULL
  LIMIT 1;

  IF existing_profile_id IS NOT NULL THEN
    -- Vincular el perfil pre-registrado al usuario autenticado
    UPDATE public.profiles
    SET
      auth_user_id = NEW.id,
      is_pre_registered = FALSE,
      avatar_url = COALESCE(avatar_url, NEW.raw_user_meta_data->>'avatar_url'),
      name = COALESCE(NULLIF(name, ''), NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      updated_at = NOW()
    WHERE id = existing_profile_id;
  ELSE
    -- Crear un perfil nuevo (comportamiento original)
    INSERT INTO public.profiles (auth_user_id, name, email, avatar_url, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      NEW.email,
      NEW.raw_user_meta_data->>'avatar_url',
      'Miembro'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Recrear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Permitir insertar en profiles sin auth_user_id (para pre-registro)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores si existen
DROP POLICY IF EXISTS "Admins can insert pre-registered profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Crear políticas nuevas
CREATE POLICY "Admins can insert pre-registered profiles"
ON profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view profiles"
ON profiles FOR SELECT USING (true);

CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE USING (true);

CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE USING (true);
