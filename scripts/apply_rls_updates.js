const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iiilenevhepdrrqbgvey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64';

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
-- FIX RLS FOR WEEKLY THEMES AND ADMIN ACCESS
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

DROP POLICY IF EXISTS "Lectura de perfiles" ON profiles;
CREATE POLICY "Lectura de perfiles" ON profiles
FOR SELECT
TO authenticated
USING (true);

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
`;

async function run() {
    console.log('Applying RLS updates for Minister role...');
    const { data, error } = await supabase.rpc('run_sql', { sql });

    if (error) {
        console.error('Error applying SQL:', error);
    } else {
        console.log('SQL applied successfully!');
    }
}

run();
