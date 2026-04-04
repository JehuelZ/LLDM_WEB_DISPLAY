require('dotenv').config();
const { createClient } = require('@supabase/supabase-client');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
    console.log('--- Database Check ---');
    const { data: profile, error } = await supabase.from('profiles').select('*').limit(1).single();
    if (error) {
        console.error('Error fetching profiles:', error);
    } else {
        console.log('Columns in profiles:', Object.keys(profile));
    }
}

checkSchema();
