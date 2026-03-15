const { createClient } = require('@supabase/supabase-js');
const URL = "https://iiilenevhepdrrqbgvey.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64";
const supabase = createClient(URL, KEY);

async function check() {
    const { data, error } = await supabase.from('schedule').select('*').limit(1);
    if (error) console.error(error);
    else if (data && data.length > 0) console.log('Columns:', Object.keys(data[0]));
    else console.log('No data in schedule table');
}
check();
