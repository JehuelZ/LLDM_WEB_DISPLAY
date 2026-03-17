-- =============================================
-- ULTRA-REPARACIÓN: TABLA DE ASISTENCIA (LLDM RODEO)
-- Objetivo: Crear la tabla faltante y corregir permisos de acceso.
-- INSTRUCCIONES: Copia y pega esto en el SQL Editor de Supabase y dale a RUN.
-- =============================================

-- 1. Crear la tabla de asistencia con la estructura requerida por el código
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    session_type TEXT NOT NULL, -- '5am', '9am', 'evening'
    present BOOLEAN DEFAULT FALSE,
    time TEXT,
    delivered_by TEXT,
    collected_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear el índice único para permitir el comando 'upsert' (guardado inteligente)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'attendance_unique_per_member_session'
    ) THEN
        ALTER TABLE public.attendance 
        ADD CONSTRAINT attendance_unique_per_member_session UNIQUE (member_id, date, session_type);
    END IF;
END $$;

-- 3. Configurar Seguridad (RLS)
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Política: Lectura permitida para todos los usuarios autenticados
DROP POLICY IF EXISTS "Permitir lectura de asistencia" ON public.attendance;
CREATE POLICY "Permitir lectura de asistencia" 
ON public.attendance FOR SELECT 
TO authenticated 
USING (true);

-- Política: Escritura permitida para Administradores y Responsables
DROP POLICY IF EXISTS "Gestionar asistencia" ON public.attendance;
CREATE POLICY "Gestionar asistencia" 
ON public.attendance FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Admin', 'Administrador', 'Responsable de Asistencia') OR 'monitor' = ANY(roles))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Admin', 'Administrador', 'Responsable de Asistencia') OR 'monitor' = ANY(roles))
    )
);

-- 4. Habilitar Tiempo Real (Realtime)
-- Recreamos la publicación para incluir todas las tablas críticas
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
    app_settings, 
    profiles, 
    announcements, 
    schedule, 
    weekly_themes, 
    attendance, 
    kids_assignments;

-- 5. Comentario de verificación
COMMENT ON TABLE public.attendance IS 'Tabla de asistencia reparada y sincronizada exitosamente';
