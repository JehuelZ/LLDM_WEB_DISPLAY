-- ========================================================
-- FASE 1: ACTUALIZACIÓN DE BASE DE DATOS - PORTAL DEL MIEMBRO
-- LLDM Rodeo
-- INSTRUCCIONES: Copia este script y ejecútalo en el SQL Editor de Supabase.
-- ========================================================

-- 1. Agregar columnas a la tabla profiles si no existen
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portal_habilitado boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portal_invite_token text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portal_invite_expires timestamptz;

-- 2. Crear función RPC segura para verificar miembro por Nombre + Teléfono
-- Permite a un miembro anónimo validar su pre-registro sin exponer toda la tabla
CREATE OR REPLACE FUNCTION verify_member_for_activation(p_name text, p_phone text)
RETURNS TABLE (id uuid, name text, phone text, portal_habilitado boolean, email text) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.phone, p.portal_habilitado, p.email
  FROM profiles p
  WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', TRIM(p_name), '%'))
    AND REGEXP_REPLACE(p.phone, '\D', '', 'g') = REGEXP_REPLACE(p_phone, '\D', '', 'g')
    AND p.auth_user_id IS NULL; -- Solo cuentas que no han sido reclamadas aún
END;
$$ LANGUAGE plpgsql;

-- 3. Crear función RPC segura para verificar miembro por Token de Invitación
-- Permite validar un token de invitación sin RLS
CREATE OR REPLACE FUNCTION verify_invite_token(p_token text)
RETURNS TABLE (id uuid, name text, email text, portal_habilitado boolean) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.email, p.portal_habilitado
  FROM profiles p
  WHERE p.portal_invite_token = p_token
    AND p.portal_invite_expires > NOW()
    AND p.auth_user_id IS NULL; -- Solo cuentas no reclamadas
END;
$$ LANGUAGE plpgsql;

-- 4. Crear función RPC segura para iniciar el proceso de reclamo (claim)
-- Asocia un email y auth_user_id a un perfil antes/durante la autenticación en Supabase Auth.
CREATE OR REPLACE FUNCTION claim_member_portal(p_profile_id uuid, p_email text, p_auth_user_id uuid DEFAULT NULL)
RETURNS boolean
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si el perfil existe y está habilitado
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_profile_id 
      AND portal_habilitado = true
  ) THEN
    -- Actualizar el correo, auth_user_id y estado en el perfil pre-registrado
    UPDATE profiles
    SET email = LOWER(TRIM(p_email)),
        auth_user_id = COALESCE(p_auth_user_id, auth_user_id),
        status = 'Activo',
        is_pre_registered = false,
        portal_invite_token = NULL, -- Limpiar token si existía
        portal_invite_expires = NULL
    WHERE id = p_profile_id;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 5. Actualizar políticas de RLS para profiles para permitir el auto-vínculo (link)
DROP POLICY IF EXISTS "Los usuarios pueden editar su propio perfil" ON profiles;

CREATE POLICY "Los usuarios pueden editar su propio perfil" 
ON profiles FOR UPDATE TO authenticated 
USING (
  auth.uid() = auth_user_id 
  OR (auth_user_id IS NULL AND LOWER(email) = LOWER(auth.jwt() ->> 'email'))
)
WITH CHECK (
  auth.uid() = auth_user_id 
  OR (auth_user_id IS NULL AND LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);
