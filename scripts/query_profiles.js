const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .order('name');

    if (error) {
        console.error('Error fetching profiles:', error);
        process.exit(1);
    }

    console.log(`Fetched ${data.length} profiles.`);
    
    // Save to live_profiles_new.json
    fs.writeFileSync(path.join(__dirname, '../live_profiles_new.json'), JSON.stringify(data, null, 2));
    console.log('Profiles saved.');
}

run();
