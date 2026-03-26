require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    console.log('--- AUDITORÍA DE ASISTENCIA LUNA ---');
    
    // 1. Total records
    const { count, error: cError } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true });
    
    console.log('Total de registros en "attendance":', count);
    if (cError) console.error('Error al contar:', cError);

    // 2. Sample records
    const { data: samples, error: sError } = await supabase
        .from('attendance')
        .select('date, session_type, member_id, present')
        .order('date', { ascending: false })
        .limit(10);
    
    console.log('Muestra de últimos 10 registros:', samples);

    // 3. Count unique dates
    const { data: uniqueDates, error: dError } = await supabase
        .from('attendance')
        .select('date');
    
    if (uniqueDates && uniqueDates.length > 0) {
        const dates = [...new Set(uniqueDates.map(d => d.date))];
        console.log('Días únicos con registros:', dates.sort().reverse());
    } else {
        console.log('No se encontraron fechas únicas con registros.');
    }

    process.exit(0);
}

check();
