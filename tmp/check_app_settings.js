const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts[1].trim();
    }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
    console.log('--- app_settings Check ---');
    const { data, error } = await supabase.from('app_settings').select('*').limit(1);
    if (error) {
        console.error('Error fetching app_settings:', error);
    } else if (data && data.length > 0) {
        console.log('Columns in app_settings:', Object.keys(data[0]));
    } else {
        console.log('No data in app_settings table');
    }
}

checkSchema();
