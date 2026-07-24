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

async function testMainChurchObj() {
    console.log('--- Testing main_church_obj for home settings storage ---');
    const { data: current, error: getErr } = await supabase.from('app_settings').select('main_church_obj').eq('id', 1).single();
    
    if (getErr) {
        console.error('Error fetching main_church_obj:', getErr);
        return;
    }
    
    console.log('Current main_church_obj:', current.main_church_obj);
    
    const updatedObj = {
        ...(current.main_church_obj || {}),
        publicHomeTestKey: 'test_value_123',
        publicHomeUpdatedAt: new Date().toISOString()
    };
    
    const { data: updateRes, error: updateErr } = await supabase
        .from('app_settings')
        .update({ main_church_obj: updatedObj })
        .eq('id', 1)
        .select('main_church_obj');
        
    if (updateErr) {
        console.error('Error updating main_church_obj:', updateErr);
    } else {
        console.log('SUCCESS! main_church_obj updated in Supabase cloud database:', updateRes);
    }
}

testMainChurchObj();
