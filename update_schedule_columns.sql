-- =============================================
-- MIGRACIÓN: Actualización de Tabla Schedule
-- Añade columnas para tiempos personalizados, idiomas y etiquetas.
-- =============================================

ALTER TABLE schedule 
ADD COLUMN IF NOT EXISTS five_am_time TEXT,
ADD COLUMN IF NOT EXISTS five_am_end_time TEXT,
ADD COLUMN IF NOT EXISTS five_am_custom_label TEXT,
ADD COLUMN IF NOT EXISTS five_am_language TEXT DEFAULT 'es',

ADD COLUMN IF NOT EXISTS nine_am_time TEXT,
ADD COLUMN IF NOT EXISTS nine_am_end_time TEXT,
ADD COLUMN IF NOT EXISTS nine_am_custom_label TEXT,
ADD COLUMN IF NOT EXISTS nine_am_language TEXT DEFAULT 'es',

ADD COLUMN IF NOT EXISTS noon_leader_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS noon_time TEXT,
ADD COLUMN IF NOT EXISTS noon_end_time TEXT,
ADD COLUMN IF NOT EXISTS noon_custom_label TEXT,

ADD COLUMN IF NOT EXISTS evening_service_end_time TEXT,
ADD COLUMN IF NOT EXISTS evening_service_language TEXT DEFAULT 'es',
ADD COLUMN IF NOT EXISTS evening_custom_label TEXT;

-- Comentario para verificar la actualización
COMMENT ON TABLE schedule IS 'Horario con soporte para idiomas, 12pm y tiempos personalizados.';
