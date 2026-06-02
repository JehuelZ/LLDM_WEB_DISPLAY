const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iiilenevhepdrrqbgvey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Testing weekly_themes safe save logic (select then update/insert)...');
    const sd = '2026-06-01';
    const ed = '2026-06-07';
    
    const dbTheme = {
        start_date: sd,
        end_date: ed,
        title: 'Tema de Prueba Antigravity (Actualizado)',
        description: 'Prueba de RLS y restricciones sin ON CONFLICT',
        type: 'free',
        file_url: null
    };

    try {
        // Query if there is an existing record with the same start_date and end_date
        const { data: existingThemes, error: checkError } = await supabase
            .from('weekly_themes')
            .select('id')
            .eq('start_date', sd)
            .eq('end_date', ed)
            .limit(1);

        if (checkError) {
            console.error('Error checking existing themes:', checkError);
            return;
        }

        let data;
        let error;

        if (existingThemes && existingThemes.length > 0) {
            const existingId = existingThemes[0].id;
            console.log(`Existing theme found with ID ${existingId}, updating...`);
            const updateRes = await supabase
                .from('weekly_themes')
                .update(dbTheme)
                .eq('id', existingId)
                .select();
            data = updateRes.data;
            error = updateRes.error;
        } else {
            console.log('No existing theme found for these dates, inserting new...');
            const insertRes = await supabase
                .from('weekly_themes')
                .insert(dbTheme)
                .select();
            data = insertRes.data;
            error = insertRes.error;
        }

        if (error) {
            console.error('Error saving theme:', error);
        } else {
            console.log('Theme saved successfully:', data);
        }
    } catch (err) {
        console.error('Caught error during save:', err);
    }
}

run();
