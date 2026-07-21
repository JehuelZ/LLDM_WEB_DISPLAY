-- =========================================================================
-- REPARACIÓN DE SEGURIDAD (RLS) - SOPORTE PARA MINISTRO A CARGO (SIN RECURSIÓN)
-- LLDM RODEO v4
-- Objetivo: Crear la función is_admin_or_minister() con SECURITY DEFINER
--           para evitar la recursión infinita en la tabla 'profiles'
--           y otorgar accesos de administración al Ministro a Cargo.
-- INSTRUCCIONES: Copia y pega TODO este código en el SQL Editor de Supabase y dale a RUN.
-- =========================================================================

-- 1. Crear o reemplazar la función de verificación (SECURITY DEFINER evade el RLS recursivo)
CREATE OR REPLACE FUNCTION public.is_admin_or_minister()
RETURNS BOOLEAN AS $$
DECLARE
  u_role TEXT;
  u_roles TEXT[];
BEGIN
  -- Hacemos la consulta directamente a la tabla física
  SELECT role, roles INTO u_role, u_roles
  FROM public.profiles 
  WHERE auth_user_id = auth.uid();
  
  RETURN (
    u_role IN ('Administrador', 'Admin', 'Ministro a Cargo', 'Ministro') 
    OR 'admin' = ANY(u_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Limpiar políticas de administración previas para evitar duplicados/conflictos
DROP POLICY IF EXISTS "Admin y Ministro gestionan avisos" ON announcements;
DROP POLICY IF EXISTS "Admin gestiona anuncios" ON announcements;
DROP POLICY IF EXISTS "Admin y Ministro gestionan temas" ON weekly_themes;
DROP POLICY IF EXISTS "Admin gestiona temas" ON weekly_themes;
DROP POLICY IF EXISTS "Admin y Ministro gestionan horarios" ON schedule;
DROP POLICY IF EXISTS "Admin gestiona horarios" ON schedule;
DROP POLICY IF EXISTS "Admin y Ministro gestionan uniformes" ON uniforms;
DROP POLICY IF EXISTS "Admin gestiona uniformes" ON uniforms;
DROP POLICY IF EXISTS "Admin y Ministro gestionan calendario uniformes" ON uniform_schedule;
DROP POLICY IF EXISTS "Admin gestiona calendario uniformes" ON uniform_schedule;
DROP POLICY IF EXISTS "Admin y Ministro gestionan asignaciones niños" ON kids_assignments;
DROP POLICY IF EXISTS "Admin gestiona asignaciones niños" ON kids_assignments;
DROP POLICY IF EXISTS "Admin y Ministro gestionan configuración" ON app_settings;
DROP POLICY IF EXISTS "Admin full access settings" ON app_settings;
DROP POLICY IF EXISTS "Admin y Ministro gestionan perfiles" ON profiles;
DROP POLICY IF EXISTS "Control total para Administradores" ON profiles;

-- 3. Crear políticas seguras usando la función is_admin_or_minister()

-- AVISOS
CREATE POLICY "Admin y Ministro gestionan avisos" ON announcements FOR ALL 
TO authenticated 
USING (is_admin_or_minister())
WITH CHECK (is_admin_or_minister());

-- TEMAS
CREATE POLICY "Admin y Ministro gestionan temas" ON weekly_themes FOR ALL 
TO authenticated 
USING (is_admin_or_minister())
WITH CHECK (is_admin_or_minister());

-- HORARIOS
CREATE POLICY "Admin y Ministro gestionan horarios" ON schedule FOR ALL 
TO authenticated 
USING (is_admin_or_minister())
WITH CHECK (is_admin_or_minister());

-- UNIFORMES
CREATE POLICY "Admin y Ministro gestionan uniformes" ON uniforms FOR ALL 
TO authenticated 
USING (is_admin_or_minister())
WITH CHECK (is_admin_or_minister());

-- CALENDARIO DE UNIFORMES
CREATE POLICY "Admin y Ministro gestionan calendario uniformes" ON uniform_schedule FOR ALL 
TO authenticated 
USING (is_admin_or_minister())
WITH CHECK (is_admin_or_minister());

-- ASIGNACIONES DE NIÑOS
CREATE POLICY "Admin y Ministro gestionan asignaciones niños" ON kids_assignments FOR ALL 
TO authenticated 
USING (is_admin_or_minister())
WITH CHECK (is_admin_or_minister());

-- CONFIGURACIÓN GLOBAL
CREATE POLICY "Admin y Ministro gestionan configuración" ON app_settings FOR ALL 
TO authenticated 
USING (is_admin_or_minister())
WITH CHECK (is_admin_or_minister());

-- PERFILES DE MIEMBROS (Esta política causaba la recursión, ahora usa la función SECURITY DEFINER)
CREATE POLICY "Admin y Ministro gestionan perfiles" ON profiles FOR ALL 
TO authenticated 
USING (is_admin_or_minister())
WITH CHECK (is_admin_or_minister());

-- Asegurar visibilidad pública de lectura para evitar errores en otras vistas públicas
DROP POLICY IF EXISTS "Lectura pública de perfiles" ON profiles;
DROP POLICY IF EXISTS "Visibilidad pública limitada de perfiles" ON profiles;
CREATE POLICY "Visibilidad pública limitada de perfiles" ON profiles FOR SELECT TO authenticated USING (true);

-- 4. Comentarios de verificación
COMMENT ON FUNCTION public.is_admin_or_minister IS 'Verifica si el usuario autenticado es Admin o Ministro sin recursión RLS.';
COMMENT ON TABLE announcements IS 'RLS habilitado y protegido. Admin y Ministro full access.';
COMMENT ON TABLE app_settings IS 'RLS habilitado y protegido. Admin y Ministro full access.';
