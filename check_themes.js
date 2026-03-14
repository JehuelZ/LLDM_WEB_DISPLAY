const { createClient } = require('@supabase/supabase-js');
const URL = "https://iiilenevhepdrrqbgvey.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64";
const supabase = createClient(URL, KEY);

async function check() {
    const today = new Date().toISOString().split('T')[0];
    console.log('Today:', today);
    
    const { data, error } = await supabase.from('weekly_themes').select('*');
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('All themes:', JSON.stringify(data, null, 2));
    }
}

check();
