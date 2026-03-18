-- =============================================
-- REPARACIÓN DE SEGURIDAD (RLS) - LLDM RODEO
-- Objetivo: Activar Row Level Security y definir políticas de acceso seguras.
-- INSTRUCCIONES: Copia este código en el SQL Editor de Supabase y dale a RUN.
-- =============================================

-- 1. Habilitar RLS en las tablas que lo tienen desactivado
ALTER TABLE IF EXISTS announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS weekly_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS uniforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS uniform_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kids_assignments ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas existentes para evitar duplicados
DROP POLICY IF EXISTS "Lectura pública de anuncios" ON announcements;
DROP POLICY IF EXISTS "Admin gestiona anuncios" ON announcements;
DROP POLICY IF EXISTS "Lectura pública de temas" ON weekly_themes;
DROP POLICY IF EXISTS "Admin gestiona temas" ON weekly_themes;
DROP POLICY IF EXISTS "Lectura pública de horarios" ON schedule;
DROP POLICY IF EXISTS "Admin gestiona horarios" ON schedule;
DROP POLICY IF EXISTS "Lectura pública de uniformes" ON uniforms;
DROP POLICY IF EXISTS "Admin gestiona uniformes" ON uniforms;
DROP POLICY IF EXISTS "Lectura pública de calendario uniformes" ON uniform_schedule;
DROP POLICY IF EXISTS "Admin gestiona calendario uniformes" ON uniform_schedule;
DROP POLICY IF EXISTS "Lectura pública de asignaciones niños" ON kids_assignments;
DROP POLICY IF EXISTS "Admin gestiona asignaciones niños" ON kids_assignments;

-- 3. Crear políticas de lectura pública (Para que el Display y la Web funcionen)
CREATE POLICY "Lectura pública de anuncios" ON announcements FOR SELECT USING (true);
CREATE POLICY "Lectura pública de temas" ON weekly_themes FOR SELECT USING (true);
CREATE POLICY "Lectura pública de horarios" ON schedule FOR SELECT USING (true);
CREATE POLICY "Lectura pública de uniformes" ON uniforms FOR SELECT USING (true);
CREATE POLICY "Lectura pública de calendario uniformes" ON uniform_schedule FOR SELECT USING (true);
CREATE POLICY "Lectura pública de asignaciones niños" ON kids_assignments FOR SELECT USING (true);

-- 4. Crear políticas de gestión para Administradores
-- Usamos una subconsulta que verifica el rol en la tabla profiles
CREATE POLICY "Admin gestiona anuncios" ON announcements FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND (role IN ('Administrador', 'Admin') OR 'admin' = ANY(roles))));

CREATE POLICY "Admin gestiona temas" ON weekly_themes FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND (role IN ('Administrador', 'Admin') OR 'admin' = ANY(roles))));

CREATE POLICY "Admin gestiona horarios" ON schedule FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND (role IN ('Administrador', 'Admin') OR 'admin' = ANY(roles))));

CREATE POLICY "Admin gestiona uniformes" ON uniforms FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND (role IN ('Administrador', 'Admin') OR 'admin' = ANY(roles))));

CREATE POLICY "Admin gestiona calendario uniformes" ON uniform_schedule FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND (role IN ('Administrador', 'Admin') OR 'admin' = ANY(roles))));

CREATE POLICY "Admin gestiona asignaciones niños" ON kids_assignments FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND (role IN ('Administrador', 'Admin') OR 'admin' = ANY(roles))));

-- 5. Comentario de verificación
COMMENT ON TABLE announcements IS 'RLS habilitado y protegido. Admin full access.';
