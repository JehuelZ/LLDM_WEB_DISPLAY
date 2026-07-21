const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envLocal = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/) || envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1], keyMatch[1]);
async function run() {
    const { data, error } = await supabase.from('schedule').select('*').eq('date', '2026-07-20');
    console.log(JSON.stringify(data, null, 2));
}
run();
