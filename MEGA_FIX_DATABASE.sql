-- =============================================
-- MEGA-REPARACIÓN DE BASE DE DATOS LLDM RODEO v2
-- Objetivo: Sincronizar el Schema con el Código del Frontend y Reparar Storage
-- INSTRUCCIONES: Copia y pega TODO este código en el SQL Editor de Supabase y dale a RUN.
-- =============================================

-- 1. ACTUALIZACIÓN DE APP_SETTINGS (Asegurar todas las columnas necesarias)
-- Estas columnas son requeridas por src/lib/store.ts para guardar la configuración.
ALTER TABLE IF EXISTS app_settings 
ADD COLUMN IF NOT EXISTS display_bg_mode TEXT DEFAULT 'official',
ADD COLUMN IF NOT EXISTS display_bg_style TEXT DEFAULT 'static',
ADD COLUMN IF NOT EXISTS display_bg_url TEXT DEFAULT '/flama-oficial.svg',
ADD COLUMN IF NOT EXISTS display_custom_bg_url TEXT,
ADD COLUMN IF NOT EXISTS church_logo_url TEXT DEFAULT '/flama-oficial.svg',
ADD COLUMN IF NOT EXISTS minister_name TEXT,
ADD COLUMN IF NOT EXISTS minister_phone TEXT,
ADD COLUMN IF NOT EXISTS minister_email TEXT,
ADD COLUMN IF NOT EXISTS minister_avatar TEXT,
ADD COLUMN IF NOT EXISTS countdown_title TEXT,
ADD COLUMN IF NOT EXISTS countdown_date TEXT,
ADD COLUMN IF NOT EXISTS show_countdown BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS countdown_logo_url TEXT DEFAULT '/flama-oficial.svg',
ADD COLUMN IF NOT EXISTS countdown_bg_color TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS countdown_accent_color TEXT DEFAULT '#d4af37',
ADD COLUMN IF NOT EXISTS countdown_bg_image_url TEXT,
ADD COLUMN IF NOT EXISTS display_authorized_emails TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS display_pin TEXT DEFAULT '1922',
ADD COLUMN IF NOT EXISTS iglesia_variant TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS iglesia_animation TEXT DEFAULT 'metro',
ADD COLUMN IF NOT EXISTS iglesia_animation_speed NUMERIC DEFAULT 2.4,
ADD COLUMN IF NOT EXISTS display_template TEXT DEFAULT 'cristal',
ADD COLUMN IF NOT EXISTS display_scale NUMERIC DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS display_offset_x INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS display_offset_y INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_theme TEXT DEFAULT 'classic',
ADD COLUMN IF NOT EXISTS low_performance_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS transitions_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS iglesia_slide_duration INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS cristal_slide_duration INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS minimal_slide_duration INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS nocturno_slide_duration INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS neon_slide_duration INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS animation_type TEXT DEFAULT 'metro',
ADD COLUMN IF NOT EXISTS animation_speed NUMERIC DEFAULT 2.4,
ADD COLUMN IF NOT EXISTS custom_logo_1 TEXT,
ADD COLUMN IF NOT EXISTS custom_logo_2 TEXT,
ADD COLUMN IF NOT EXISTS custom_logo_3 TEXT,
ADD COLUMN IF NOT EXISTS custom_logo_4 TEXT,
ADD COLUMN IF NOT EXISTS weather_unit TEXT DEFAULT 'fahrenheit',
ADD COLUMN IF NOT EXISTS display_font_family TEXT DEFAULT 'Outfit',
ADD COLUMN IF NOT EXISTS display_font_weight TEXT DEFAULT '400';

-- Asegurar que existe el registro único con ID=1
INSERT INTO app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 2. REVISIÓN DE TABLAS DE CONTENIDO
ALTER TABLE IF EXISTS announcements ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS favorite_verse TEXT;

-- 3. CONFIGURACIÓN DE STORAGE (BUCKETS)
-- Crear los buckets necesarios si no existen
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('app_assets', 'app_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Limpiar políticas viejas para evitar conflictos
DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Auth Delete" ON storage.objects;

-- Políticas para el bucket 'avatars' (usado para logos y fotos de perfil)
CREATE POLICY "Avatar Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Avatar Auth Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Avatar Auth Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Avatar Auth Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- Políticas para el bucket 'app_assets'
CREATE POLICY "Assets Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'app_assets');
CREATE POLICY "Assets Auth Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app_assets');
CREATE POLICY "Assets Auth Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'app_assets');

-- 4. PERMISOS DE TABLAS (RLS)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los administradores pueden hacer TODO en app_settings
DROP POLICY IF EXISTS "Admin full access settings" ON app_settings;
CREATE POLICY "Admin full access settings" 
ON app_settings FOR ALL TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE auth_user_id = auth.uid() 
    AND (role IN ('Admin', 'Administrador') OR 'admin' = ANY(roles))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE auth_user_id = auth.uid() 
    AND (role IN ('Admin', 'Administrador') OR 'admin' = ANY(roles))
  )
);

-- Política: Lectura pública de app_settings (para el display)
DROP POLICY IF EXISTS "Public read settings" ON app_settings;
CREATE POLICY "Public read settings" ON app_settings FOR SELECT USING (true);

-- 5. REFRESCAR SISTEMA DE REALTIME
-- Esto asegura que los cambios se propaguen a todas las pantallas abiertas
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE app_settings, profiles, announcements, schedule, weekly_themes;

-- COMENTARIO DE ÉXITO
COMMENT ON TABLE app_settings IS 'Base de datos reparada exitosamente para LLDM RODEO v2';
