-- =============================================
-- PARCHE DE VISIBILIDAD DE ASISTENCIA (LLDM RODEO)
-- Objetivo: Permitir que el Dashboard y los Monitores vean los datos de asistencia.
-- INSTRUCCIONES: Copia y pega esto en el SQL Editor de Supabase y dale a RUN.
-- =============================================

-- 1. Asegurar que RLS esté activo
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 2. Permitir lectura pública de asistencia (Necesario para el Dashboard y Monitor)
DROP POLICY IF EXISTS "Permitir lectura de asistencia" ON public.attendance;
CREATE POLICY "Permitir lectura de asistencia" 
ON public.attendance FOR SELECT 
TO public 
USING (true);

-- 3. Asegurar que los administradores puedan seguir gestionando todo
DROP POLICY IF EXISTS "Gestionar asistencia" ON public.attendance;
CREATE POLICY "Gestionar asistencia" 
ON public.attendance FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Admin', 'Administrador', 'Responsable de Asistencia') OR 'admin' = ANY(roles) OR 'monitor' = ANY(roles))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Admin', 'Administrador', 'Responsable de Asistencia') OR 'admin' = ANY(roles) OR 'monitor' = ANY(roles))
    )
);

-- 4. Comentario de verificación
COMMENT ON TABLE public.attendance IS 'Visibilidad de asistencia corregida para acceso publico de lectura.';
