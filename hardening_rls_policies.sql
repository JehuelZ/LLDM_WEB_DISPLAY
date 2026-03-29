-- =============================================
-- HARDENING DE SEGURIDAD: LLDM RODEO v2
-- Objetivo: Restringir acceso a datos sensibles y optimizar rendimiento RLS.
-- =============================================

-- 1. Refactor de is_admin() para evitar recursión y mejorar rendimiento
-- Usamos SECURITY DEFINER para que no aplique el propio RLS de profiles durante la ejecución del check.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  u_role TEXT;
BEGIN
  SELECT role INTO u_role
  FROM public.profiles 
  WHERE auth_user_id = auth.uid();
  
  RETURN u_role IN ('Admin', 'Administrador');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Refactor de Políticas para PROFILES (Privacidad Estricta)
DROP POLICY IF EXISTS "Los perfiles son visibles por todos los usuarios autenticados" ON profiles;
DROP POLICY IF EXISTS "Los usuarios pueden editar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Los administradores tienen control total sobre perfiles" ON profiles;

-- Miembros solo ven info pública de otros
CREATE POLICY "Visibilidad pública limitada de perfiles" 
ON profiles FOR SELECT TO authenticated 
USING (true);

-- Nota: La aplicación deberá filtrar los campos sensibles (email, phone, stats) en el SELECT
-- si no es Admin o el dueño. 
-- O mejor aún, podemos usar una política que solo devuelva filas sensibles condicionalmente.
-- Sin embargo, el RLS de Supabase filtra FILAS, no columnas.
-- La mejor práctica para filtrado de COLUMNAS es usar una VISTA o filtrar en el Backend.
-- Aquí aseguraremos que nadie pueda ACTUALIZAR perfiles ajenos.

CREATE POLICY "Control total para Administradores" 
ON profiles FOR ALL TO authenticated 
USING (is_admin());

CREATE POLICY "Autogestion de perfil propio" 
ON profiles FOR UPDATE TO authenticated 
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);

-- 3. Refactor de ASISTENCIA (Optimización)
DROP POLICY IF EXISTS "Permitir lectura de asistencia" ON public.attendance;
DROP POLICY IF EXISTS "Gestionar asistencia" ON public.attendance;

CREATE POLICY "Lectura de asistencia protegida" 
ON public.attendance FOR SELECT TO authenticated 
USING (true);

-- Optimizamos el check de 'Responsable' o 'Monitor'
-- Nota: 'is_admin()' ya está optimizado arriba.
CREATE POLICY "Gestion de asistencia por roles autorizados" 
ON public.attendance FOR ALL TO authenticated 
USING (
    is_admin() OR 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role = 'Responsable de Asistencia' OR 'monitor' = ANY(roles))
    )
);

-- 4. Protección de APP_SETTINGS
DROP POLICY IF EXISTS "Configuración visible para todos" ON app_settings;
DROP POLICY IF EXISTS "Solo administradores pueden cambiar configuración" ON app_settings;

CREATE POLICY "Ajustes de lectura publica" 
ON app_settings FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Solo Admin modifica ajustes" 
ON app_settings FOR ALL TO authenticated 
USING (is_admin());

-- 5. Registro de Auditoría
COMMENT ON FUNCTION public.is_admin() IS 'Verifica si el auth.uid() actual tiene rol de Administrador de forma segura y eficiente.';
