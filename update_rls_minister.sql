-- FIX RLS FOR WEEKLY THEMES AND ADMIN ACCESS
-- Permite que el Ministro a Cargo también gestione temas y vea contenido administrativo

-- 1. Asegurar que weekly_themes tenga políticas para Ministro a Cargo
DROP POLICY IF EXISTS "Admin gestiona temas" ON weekly_themes;

CREATE POLICY "Admin y Ministro gestionan temas" ON weekly_themes
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Administrador', 'Admin', 'Ministro a Cargo') OR 'admin' = ANY(roles))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Administrador', 'Admin', 'Ministro a Cargo') OR 'admin' = ANY(roles))
    )
);

-- 2. Asegurar que profiles permita al Ministro verse a sí mismo y a otros (lectura)
DROP POLICY IF EXISTS "Lectura de perfiles" ON profiles;
CREATE POLICY "Lectura de perfiles" ON profiles
FOR SELECT
TO authenticated
USING (true);

-- 3. Asegurar que el Ministro pueda editar perfiles si tiene el rol (opcional, pero útil)
DROP POLICY IF EXISTS "Admin edita perfiles" ON profiles;
CREATE POLICY "Admin y Ministro editan perfiles" ON profiles
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Administrador', 'Admin', 'Ministro a Cargo') OR 'admin' = ANY(roles))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Administrador', 'Admin', 'Ministro a Cargo') OR 'admin' = ANY(roles))
    )
);

-- 4. Notificaciones y Avisos (Announcements)
DROP POLICY IF EXISTS "Admin gestiona avisos" ON announcements;
CREATE POLICY "Admin y Ministro gestionan avisos" ON announcements
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Administrador', 'Admin', 'Ministro a Cargo') OR 'admin' = ANY(roles))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND (role IN ('Administrador', 'Admin', 'Ministro a Cargo') OR 'admin' = ANY(roles))
    )
);

-- 5. Evitar duplicados: Agregar restricción única por rango de fechas
ALTER TABLE weekly_themes DROP CONSTRAINT IF EXISTS weekly_themes_dates_key;
ALTER TABLE weekly_themes ADD CONSTRAINT weekly_themes_dates_key UNIQUE (start_date, end_date);

-- 6. Comentario de verificación
COMMENT ON TABLE announcements IS 'RLS habilitado y protegido. Admin y Ministro full access.';
COMMENT ON TABLE weekly_themes IS 'RLS habilitado. Restricción única en fechas para evitar duplicados.';
