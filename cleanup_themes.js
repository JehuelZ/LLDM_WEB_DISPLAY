const { createClient } = require('@supabase/supabase-js');
const URL = "https://iiilenevhepdrrqbgvey.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64";
const supabase = createClient(URL, KEY);

async function cleanup() {
    const { data } = await supabase.from('weekly_themes').select('id, title, created_at').order('created_at', { ascending: false });
    if (!data || data.length === 0) return;

    const seen = new Set();
    const toDelete = [];

    // Keep the most recent one for each title
    for (const theme of data) {
        if (seen.has(theme.title)) {
            toDelete.push(theme.id);
        } else {
            seen.add(theme.title);
        }
    }

    if (toDelete.length > 0) {
        console.log('Deleting duplicates:', toDelete.length);
        const { error } = await supabase.from('weekly_themes').delete().in('id', toDelete);
        if (error) console.error('Error deleting:', error);
        else console.log('Cleanup successful');
    } else {
        console.log('No duplicates found');
    }
}

cleanup();
