import json
import urllib.request
import urllib.error
import ssl

URL = "https://iiilenevhepdrrqbgvey.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

sql = """
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
"""

def make_rpc_request(endpoint, payload):
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json"
    }
    req = urllib.request.Request(f"{URL}/rest/v1/rpc/{endpoint}", method="POST", headers=headers)
    req.data = json.dumps(payload).encode("utf-8")
    
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        print(f"Error: {e.code} - {e.read().decode()}")
        return None

def main():
    print("Applying RLS updates for Minister role...")
    result = make_rpc_request("run_sql", {"sql": sql})
    if result is not None:
        print("SQL applied successfully!")
    else:
        print("Failed to apply SQL.")

if __name__ == '__main__':
    main()
