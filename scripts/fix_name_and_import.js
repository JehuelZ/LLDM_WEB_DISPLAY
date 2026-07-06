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

const supabase = createClient(supabaseUrl, supabaseKey);

const KEREN_UUID = '22e7cd9e-53ea-4fa6-99d5-6e822eabd00b';

async function run() {
    console.log(`Updating profile name in database for UUID: ${KEREN_UUID}...`);
    
    const { data, error } = await supabase
        .from('profiles')
        .update({ name: 'Kerin Hernández' })
        .eq('id', KEREN_UUID)
        .select();

    if (error) {
        console.error('Error updating name in database:', error);
        process.exit(1);
    }

    console.log('Profile name successfully updated to "Kerin Hernández":', data);

    // Now execute the import script to update the remaining dates
    console.log('Executing the schedule importer script...');
    const updateScript = require('./update_july_schedule.js');
}

run();
