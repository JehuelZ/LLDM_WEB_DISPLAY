-- =============================================
-- REPARACIÓN TOTAL DE DATOS LLDM RODEO (2024)
-- Objetivo: Sincronizar tablas faltantes y corregir RLS.
-- INSTRUCCIONES: Copia este código en el SQL Editor de Supabase y presiona RUN.
-- =============================================

-- 1. CREAR TABLA DE ENSAYOS DE CORO (Si no existe)
CREATE TABLE IF NOT EXISTS public.choir_rehearsals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day_of_week INTEGER NOT NULL, -- 0-6 (Domingo-Sábado)
    time TEXT NOT NULL,
    location TEXT DEFAULT 'Santuario',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ASEGURAR TABLA DE CALENDARIO DE UNIFORMES
CREATE TABLE IF NOT EXISTS public.uniform_schedule (
    date DATE PRIMARY KEY,
    uniform_id UUID REFERENCES public.uniforms(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HABILITAR SEGURIDAD (RLS)
ALTER TABLE public.choir_rehearsals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uniform_schedule ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE ACCESO PARA ENSAYOS
DROP POLICY IF EXISTS "Lectura pública de ensayos" ON public.choir_rehearsals;
CREATE POLICY "Lectura pública de ensayos" ON public.choir_rehearsals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestión de ensayos por Admin/Coro" ON public.choir_rehearsals;
CREATE POLICY "Gestión de ensayos por Admin/Coro" ON public.choir_rehearsals 
FOR ALL TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE auth_user_id = auth.uid() 
    AND (role IN ('Admin', 'Administrador', 'Dirigente Coro Adultos') OR 'choir' = ANY(roles))
  )
);

-- 5. POLÍTICAS DE ACCESO PARA UNIFORMES
DROP POLICY IF EXISTS "Lectura pública de uniformes" ON public.uniform_schedule;
CREATE POLICY "Lectura pública de uniformes" ON public.uniform_schedule FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestión de uniformes por Admin" ON public.uniform_schedule;
CREATE POLICY "Gestión de uniformes por Admin" ON public.uniform_schedule 
FOR ALL TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE auth_user_id = auth.uid() 
    AND (role IN ('Admin', 'Administrador') OR 'admin' = ANY(roles))
  )
);

-- 6. ACTUALIZAR PUBLICACIÓN REALTIME
-- Nota: Esto fuerza la sincronización en tiempo real para las nuevas tablas.
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
    app_settings, 
    profiles, 
    announcements, 
    schedule, 
    weekly_themes, 
    attendance, 
    kids_assignments,
    choir_rehearsals,
    uniform_schedule;

-- COMENTARIO DE ÉXITO
COMMENT ON TABLE public.choir_rehearsals IS 'Tabla de ensayos sincronizada con el frontend';
