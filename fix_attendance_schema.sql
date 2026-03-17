-- =============================================
-- FIX DEFINITIVO: Reparar Tabla de Asistencia (Lógica Triple Marcado)
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- 1. Crear la tabla de asistencia si no existe o repararla
-- Usamos 'IF NOT EXISTS' para no borrar datos si ya la tienes.
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    session_type TEXT NOT NULL, -- Valores permitidos: '5am', '9am', 'evening'
    present BOOLEAN DEFAULT FALSE,
    time TEXT,
    delivered_by TEXT,
    collected_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. REGLA DE ORO: Crear el Índice Único necesario para el comando 'upsert'
-- Si este índice no existe, el sistema no sabe qué registro actualizar y tira error.
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'attendance_unique_per_member_session'
    ) THEN
        ALTER TABLE public.attendance 
        ADD CONSTRAINT attendance_unique_per_member_session UNIQUE (member_id, date, session_type);
    END IF;
END $$;

-- 3. Habilitar Seguridad (RLS)
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 4. Nueva Política de Seguridad (Permite a Administradores y Responsables Guardar)
-- Esto corrige posibles errores de "Permission Denied"
DROP POLICY IF EXISTS "Solo responsables pueden gestionar asistencia" ON public.attendance;
CREATE POLICY "Solo responsables pueden gestionar asistencia" 
ON public.attendance FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (
            role IN ('Administrador', 'Admin', 'Responsable de Asistencia') 
            OR 'monitor' = ANY(roles)
        )
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (
            role IN ('Administrador', 'Admin', 'Responsable de Asistencia') 
            OR 'monitor' = ANY(roles)
        )
    )
);

-- 5. Política para que todos vean la asistencia (para reportes y estadísticas)
DROP POLICY IF EXISTS "Asistencia visible para todos" ON public.attendance;
CREATE POLICY "Asistencia visible para todos" 
ON public.attendance FOR SELECT TO authenticated USING (true);

-- 6. Habilitar Tiempo Real
-- Nota: Si falla porque ya está añadido, ignora el mensaje de abajo.
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
