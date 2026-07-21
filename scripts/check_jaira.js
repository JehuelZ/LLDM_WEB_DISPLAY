const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iiilenevhepdrrqbgvey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const sql = `
        SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
        FROM pg_policies 
        WHERE tablename = 'schedule';
    `;
    
    const { data, error } = await supabase.rpc('run_sql', { sql });

    if (error) {
        console.error('Error running SQL:', error);
    } else {
        console.log('Policies on schedule table:', JSON.stringify(data, null, 2));
    }
}

run();
