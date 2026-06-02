const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iiilenevhepdrrqbgvey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Setting weekly theme for June 1st - June 7th, 2026...');
    const sd = '2026-06-01';
    const ed = '2026-06-07';
    
    const dbTheme = {
        start_date: sd,
        end_date: ed,
        title: 'Amaras al prójimo',
        description: '',
        type: 'orthodoxy',
        file_url: null
    };

    try {
        const { data: existingThemes } = await supabase
            .from('weekly_themes')
            .select('id')
            .eq('start_date', sd)
            .eq('end_date', ed)
            .limit(1);

        let data;
        let error;

        if (existingThemes && existingThemes.length > 0) {
            const existingId = existingThemes[0].id;
            console.log(`Theme exists with ID ${existingId}, updating...`);
            const updateRes = await supabase
                .from('weekly_themes')
                .update(dbTheme)
                .eq('id', existingId)
                .select();
            data = updateRes.data;
            error = updateRes.error;
        } else {
            console.log('Inserting new theme...');
            const insertRes = await supabase
                .from('weekly_themes')
                .insert(dbTheme)
                .select();
            data = insertRes.data;
            error = insertRes.error;
        }

        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Theme saved successfully:', data);
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

run();
