-- =============================================
-- LLDM RODEO - MEGA FIX SUPABASE (ABRIL 2026)
-- Reparación de Tablas de Mensajería, Asignaciones y Permisos
-- =============================================

-- 1. TABLA: Mensajes de Asistencia / Congregación
-- Nota: Esta tabla es vital para el Inbox del Administrador
CREATE TABLE IF NOT EXISTS public.attendance_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT,
    subject TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA: Asignaciones de Niños (Pizarra / Kids)
CREATE TABLE IF NOT EXISTS public.kids_assignments (
    date DATE PRIMARY KEY,
    monitor_id UUID REFERENCES public.profiles(id),
    reconciliation_leader_id UUID REFERENCES public.profiles(id),
    service_child_id UUID REFERENCES public.profiles(id),
    doctrine_child_id UUID REFERENCES public.profiles(id),
    uniform_id UUID REFERENCES public.profiles(id),
    choir_participation TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HABILITAR RLS (Seguridad)
ALTER TABLE public.attendance_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids_assignments ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE SEGURIDAD (Permitir lectura y escritura a miembros autenticados)
-- Mensajes: Todos pueden enviar, solo destinatario/admin puede leer (Simplificado para evitar bloqueos)
DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados" ON public.attendance_messages;
CREATE POLICY "Permitir todo a usuarios autenticados" 
ON public.attendance_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Asignaciones: Todos pueden ver, Admin puede editar
DROP POLICY IF EXISTS "Todos pueden ver asignaciones" ON public.kids_assignments;
CREATE POLICY "Todos pueden ver asignaciones" 
ON public.kids_assignments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Solo admin edita asignaciones" ON public.kids_assignments;
CREATE POLICY "Solo admin edita asignaciones" 
ON public.kids_assignments FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('Admin', 'Administrador')))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('Admin', 'Administrador')));

-- 5. HABILITAR REALTIME
-- Esto es CRÍTICO para que el Inbox se actualice sin refrescar la página
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'attendance_messages') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE attendance_messages;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'kids_assignments') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE kids_assignments;
    END IF;
END $$;

-- 6. REPARACIÓN DE COLUMNAS FALTANTES EN APP_SETTINGS
-- Asegurar que existan las columnas para los nuevos temas y animaciones
DO $$
BEGIN
    -- Columnas de Duración
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_settings' AND column_name = 'luna_slide_duration') THEN
        ALTER TABLE public.app_settings ADD COLUMN luna_slide_duration INTEGER DEFAULT 12;
    END IF;
    
    -- Columna de Modo Rendimiento
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_settings' AND column_name = 'low_performance_mode') THEN
        ALTER TABLE public.app_settings ADD COLUMN low_performance_mode BOOLEAN DEFAULT FALSE;
    END IF;

    -- Columnas de Tipografía
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_settings' AND column_name = 'display_font_family') THEN
        ALTER TABLE public.app_settings ADD COLUMN display_font_family TEXT DEFAULT 'Inter';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_settings' AND column_name = 'display_font_weight') THEN
        ALTER TABLE public.app_settings ADD COLUMN display_font_weight TEXT DEFAULT '400';
    END IF;
END $$;
