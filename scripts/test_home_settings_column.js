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

async function run() {
    console.log('--- Testing public_home_settings JSON column ---');
    
    // Test if public_home_settings column exists by updating id=1
    const testData = {
        public_home_settings: {
            test: true,
            updatedAt: new Date().toISOString()
        }
    };
    
    const { data, error } = await supabase
        .from('app_settings')
        .update(testData)
        .eq('id', 1)
        .select('*');
        
    if (error) {
        console.log('Column public_home_settings does not exist yet:', error.message);
    } else {
        console.log('Success! public_home_settings column exists and updated:', data);
    }
}

run();
