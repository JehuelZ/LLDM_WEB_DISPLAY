-- =============================================
-- MIGRACIÓN DE SEGURIDAD: LLDM RODEO v1
-- Objetivo: Habilitar RLS y definir políticas de acceso.
-- =============================================

-- 1. Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniform_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2. Función auxiliar para verificar si el usuario es Administrador
-- NOTA: Se comprueba tanto 'Admin' como 'Administrador' por compatibilidad.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role IN ('Admin', 'Administrador')
    FROM profiles 
    WHERE auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Políticas para PROFILES
CREATE POLICY "Los perfiles son visibles por todos los usuarios autenticados" 
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Los usuarios pueden editar su propio perfil" 
ON profiles FOR UPDATE TO authenticated 
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Los administradores tienen control total sobre perfiles" 
ON profiles FOR ALL TO authenticated 
USING (is_admin());

-- 4. Políticas para SCHEDULE (Horarios)
CREATE POLICY "Horarios visibles para todos (incluso navegación anon)" 
ON schedule FOR SELECT USING (true);

CREATE POLICY "Solo administradores pueden modificar horarios" 
ON schedule FOR ALL TO authenticated 
USING (is_admin());

-- 5. Políticas para ANNOUNCEMENTS (Anuncios)
CREATE POLICY "Anuncios visibles para todos" 
ON announcements FOR SELECT USING (true);

CREATE POLICY "Solo administradores pueden gestionar anuncios" 
ON announcements FOR ALL TO authenticated 
USING (is_admin());

-- 6. Políticas para WEEKLY_THEMES
CREATE POLICY "Temas visibles para todos" 
ON weekly_themes FOR SELECT USING (true);

CREATE POLICY "Solo administradores pueden gestionar temas" 
ON weekly_themes FOR ALL TO authenticated 
USING (is_admin());

-- 7. Políticas para APP_SETTINGS
CREATE POLICY "Configuración visible para todos" 
ON app_settings FOR SELECT USING (true);

CREATE POLICY "Solo administradores pueden cambiar configuración" 
ON app_settings FOR ALL TO authenticated 
USING (is_admin());

-- 8. Políticas para MENSAJES (Privacidad Estricta)
CREATE POLICY "Usuarios ven mensajes que enviaron o recibieron" 
ON messages FOR SELECT TO authenticated 
USING (auth.uid() IN (
  SELECT auth_user_id FROM profiles WHERE id = sender_id OR id = receiver_id
));

CREATE POLICY "Usuarios pueden enviar mensajes" 
ON messages FOR INSERT TO authenticated 
WITH CHECK (auth.uid() IN (
  SELECT auth_user_id FROM profiles WHERE id = sender_id
));

-- 9. Políticas para UNIFORMES y KIDS_ASSIGNMENTS
CREATE POLICY "Uniformes visibles para todos" ON uniforms FOR SELECT USING (true);
CREATE POLICY "Admin gestiona uniformes" ON uniforms FOR ALL USING (is_admin());

CREATE POLICY "Calendario de uniformes visible para todos" ON uniform_schedule FOR SELECT USING (true);
CREATE POLICY "Admin gestiona calendario uniformes" ON uniform_schedule FOR ALL USING (is_admin());

CREATE POLICY "Asignaciones de niños visibles para todos" ON kids_assignments FOR SELECT USING (true);
CREATE POLICY "Admin gestiona asignaciones niños" ON kids_assignments FOR ALL USING (is_admin());
