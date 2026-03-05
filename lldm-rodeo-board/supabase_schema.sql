
-- =============================================
-- LLDM RODEO - Schema de Base de Datos v2
-- Soporta: Pre-registro de miembros por Admin
-- =============================================

-- Tabla para los Perfiles de Usuario
-- NOTA: id es auto-generado. auth_user_id se vincula cuando el miembro inicia sesión.
-- Esto permite que el Admin pre-registre miembros SIN que tengan cuenta Google aún.
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users ON DELETE SET NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  category TEXT CHECK (category IN ('Varon', 'Hermana', 'Niño')),
  member_group TEXT,
  role TEXT DEFAULT 'Miembro',
  gender TEXT DEFAULT 'Varon',
  status TEXT DEFAULT 'Activo',
  last_active TEXT DEFAULT 'Hoy',
  stats JSONB DEFAULT '{"attendance": {"attended": 0, "total": 1}, "participation": {"led": 0, "total": 1}, "punctuality": 0}',
  roles TEXT[] DEFAULT '{}',
  is_pre_registered BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para Anuncios
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para el Horario Semanal / Mensual
CREATE TABLE schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  five_am_leader_id UUID REFERENCES profiles(id),
  nine_am_consecration_leader_id UUID REFERENCES profiles(id),
  nine_am_doctrine_leader_id UUID REFERENCES profiles(id),
  evening_service_type TEXT,
  evening_service_time TEXT DEFAULT '7:00 PM',
  evening_leader_ids UUID[] DEFAULT '{}',
  topic TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para Temas Semanales
CREATE TABLE weekly_themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para Uniformes
CREATE TABLE uniforms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('Adulto', 'Niño')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para Calendario de Uniformes
CREATE TABLE uniform_schedule (
  date DATE PRIMARY KEY,
  uniform_id UUID REFERENCES uniforms(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para Asignaciones de Niños
CREATE TABLE kids_assignments (
  date DATE PRIMARY KEY,
  monitor_id UUID REFERENCES profiles(id),
  reconciliation_leader_id UUID REFERENCES profiles(id),
  service_child_id UUID REFERENCES profiles(id),
  doctrine_child_id UUID REFERENCES profiles(id),
  uniform_id UUID REFERENCES uniforms(id),
  choir_participation TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para Configuración Global
CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  theme_mode TEXT DEFAULT 'system',
  language TEXT DEFAULT 'es',
  church_icon TEXT DEFAULT 'shield',
  custom_icon_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  show_minister_on_display BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración inicial
INSERT INTO app_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Tabla para Mensajes/Comunicación
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_role TEXT,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TRIGGER: Al registrarse un usuario nuevo con Google
-- Si ya existe un perfil pre-registrado con ese email, lo vincula.
-- Si no existe, crea uno nuevo automáticamente.
-- =============================================
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
    -- Crear un perfil nuevo como siempre
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

-- Eliminar trigger anterior si existe y recrear
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Habilitar Realtime para estas tablas
ALTER PUBLICATION supabase_realtime ADD TABLE app_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE schedule;
ALTER PUBLICATION supabase_realtime ADD TABLE weekly_themes;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE uniforms;
ALTER PUBLICATION supabase_realtime ADD TABLE uniform_schedule;
ALTER PUBLICATION supabase_realtime ADD TABLE kids_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
