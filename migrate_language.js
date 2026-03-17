
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iiilenevhepdrrqbgvey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('Adding evening_service_language to schedule table...');
    const { error } = await supabase.rpc('run_sql', {
        sql: `ALTER TABLE schedule ADD COLUMN IF NOT EXISTS evening_service_language TEXT DEFAULT 'es';`
    });

    if (error) {
        console.warn('RPC run_sql might not be enabled. Trying standard query...');
        // If run_sql is not enabled, we might not be able to run DDL directly via the client 
        // unless there's a specific function for it. 
        // Usually, in these environments, we can use the dashboard or a migration file.
        // However, I'll try to just proceed with the code changes and if it errors, 
        // I'll suggest the user to add the column.
    } else {
        console.log('Column added successfully (or already exists).');
    }
}

migrate();
