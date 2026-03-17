
-- =============================================
-- CONFIGURACIÓN DE STORAGE PARA LLDM RODEO
-- Ejecutar este script en el SQL Editor de Supabase
-- =============================================

-- 1. Crear el bucket 'app_assets' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('app_assets', 'app_assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar el acceso público para lectura (ya está implícito en public=true, pero por si acaso)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'app_assets' );

-- 3. Permitir a usuarios autenticados subir imágenes
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'app_assets' );

-- 4. Permitir a usuarios autenticados actualizar sus propias imágenes (o todas para este caso simplificado)
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'app_assets' );

-- 5. Permitir a usuarios autenticados eliminar imágenes
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'app_assets' );

-- 6. Política extra para usuarios ANÓNIMOS (solo si necesitas que invitados suban fotos, aunque no es recomendado)
-- Descomenta si es necesario:
-- CREATE POLICY "Allow anonymous uploads" ON storage.objects FOR INSERT TO anon WITH CHECK ( bucket_id = 'app_assets' );
