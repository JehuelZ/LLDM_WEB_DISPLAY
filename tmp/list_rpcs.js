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

async function listRpcs() {
    console.log('--- RPC functions ---');
    const { data, error } = await supabase.rpc('get_rpcs'); // If it doesn't exist, we will try a direct query
    if (error) {
        console.log('RPC get_rpcs failed, trying direct select on pg_proc...');
        // Wait, supabase REST API doesn't allow select on pg_proc unless it is exposed.
        // Let's try to query pg_catalog or list what we can
        console.error(error);
    } else {
        console.log(data);
    }
}

listRpcs();
