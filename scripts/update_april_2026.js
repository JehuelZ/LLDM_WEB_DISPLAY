const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Profiles mapping (from payload.json and subagent list)
const profilesPath = path.join(__dirname, '..', 'payload.json');
const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));

function findId(name) {
    if (!name) return null;
    const n = name.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents
    
    // Explicit mappings
    if (n === 'lucia zelaya') return 'c581eb3c-cb8c-4ac6-afff-0e32039654ca'; // Lucia Nardone
    if (n === 'melquisedec serrano') return '55d5ccdf-073b-491e-b34c-fd091eb06bb1'; // Mequisedec Serrano
    if (n === 'grabriele zelaya') return 'e6c98339-f601-4460-b593-b8c349a8b145';
    if (n === 'kerin hernandez') return '22e7cd9e-53ea-4fa6-99d5-6e822eabd00b'; // Keren Hernández

    const match = profiles.find(p => {
        const pn = p.name.toLowerCase().trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return pn === n || pn.includes(n) || n.includes(pn);
    });
    return match ? match.id : null;
}

// Schedule data parsed from PDF
const scheduleData = [
    { date: '2026-03-30', five_am: 'Leonel Marrufo', evening: 'Josue Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-03-31', five_am: 'Esteban Serrano', evening: 'Fredy Ruiz', nine_am_1: 'Sibia Marrufo', nine_am_2: 'Elizabeth Ramirez' },
    { date: '2026-04-01', five_am: 'Manuel Diaz', evening: 'Manuel Gutierrez', nine_am_1: 'Socorro Ruiz', nine_am_2: 'Lucia Zelaya' },
    { date: '2026-04-02', five_am: 'Josue Diaz', evening: 'Gerson Zelaya', nine_am_1: 'Rhode Adan', topic: 'Servicio Ingles / Doctrina: Melquisedec Serrano' },
    { date: '2026-04-03', five_am: 'Abraham Diaz', evening: 'Pablo Santizo', nine_am_1: 'Amisadai Alvarado' },
    { date: '2026-04-04', five_am: 'Abidan Alvarado', evening: 'Oliver Montano', nine_am_1: 'Raama Chasova', nine_am_2: 'Judith Chasova', topic: 'Servicio Niños / Doctrina: Naason Alvarado / Consagración: Isai Hernandez' },
    { date: '2026-04-05', five_am: 'Eliab R. Aguilar', evening: 'Esteban Serrano', topic: 'Servicio: Esteban Serrano / Explicación: Ramon Serrano' },
    
    { date: '2026-04-06', five_am: 'Leonel Marrufo', evening: 'Abraham Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-04-07', five_am: 'Esteban Serrano', evening: 'Eliab R. Aguilar', nine_am_1: 'Maria Gutierrez', nine_am_2: 'Sibia Marrufo' },
    { date: '2026-04-08', five_am: 'Manuel Diaz', evening: 'Ignacio Ramirez', nine_am_1: 'Lucia Zelaya', nine_am_2: 'Socorro Ruiz' },
    { date: '2026-04-09', five_am: 'Josue Diaz', evening: 'Abidan Alvarado', nine_am_1: 'Rhode Adan', topic: 'Servicio / Doctrina: Fredy Ruiz' },
    { date: '2026-04-10', five_am: 'Abraham Diaz', evening: 'Jairo Zelaya', nine_am_1: 'Judith Chasova' },
    { date: '2026-04-11', five_am: 'Gerson Zelaya', evening: 'Pablo Santizo', nine_am_1: 'Rosa Ramirez', nine_am_2: 'Rebeca Ramirez' },
    { date: '2026-04-12', five_am: 'Eliab R. Aguilar', evening: 'Leonel Marrufo', topic: 'Servicio: Leonel Marrufo / Explicación: Jairo Zelaya' },

    { date: '2026-04-13', five_am: 'Leonel Marrufo', evening: 'Josue Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-04-14', five_am: 'Esteban Serrano', evening: 'Eliab R. Aguilar', nine_am_1: 'Sibia Marrufo', nine_am_2: 'Maria Gutierrez' },
    { date: '2026-04-15', five_am: 'Manuel Diaz', evening: 'Pablo Santizo', nine_am_1: 'Socorro Ruiz', nine_am_2: 'Lucia Zelaya' },
    { date: '2026-04-16', five_am: 'Josue Diaz', evening: 'Elias Ruiz', nine_am_1: 'Rhode Adan', topic: 'Servicio Ingles / Doctrina: Melquisedec Serrano' },
    { date: '2026-04-17', five_am: 'Abraham Diaz', evening: 'Leonel Marrufo', nine_am_1: 'Amisadai Alvarado' },
    { date: '2026-04-18', five_am: 'Elias Ruiz', evening: 'Gabriele Zelaya', nine_am_1: 'Abigail Hernandez', nine_am_2: 'Kerin Hernandez', topic: 'Servicio Niños / Doctrina: Isai Hernandez / Consagración: Oliver Montano' },
    { date: '2026-04-19', five_am: 'Eliab R. Aguilar', evening: 'Ramon Serrano', topic: 'Servicio: Ramon Serrano / Explicación: Ignacio Ramirez' },

    { date: '2026-04-20', five_am: 'Leonel Marrufo', evening: 'Abraham Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-04-21', five_am: 'Esteban Serrano', evening: 'Eliab R. Aguilar', nine_am_1: 'Maria Gutierrez', nine_am_2: 'Sibia Marrufo' },
    { date: '2026-04-22', five_am: 'Manuel Diaz', evening: 'Manuel Gutierrez', nine_am_1: 'Lucia Zelaya', nine_am_2: 'Socorro Ruiz' },
    { date: '2026-04-23', five_am: 'Josue Diaz', evening: 'Gerson Zelaya', nine_am_1: 'Rhode Adan', topic: 'Servicio / Doctrina: Fredy Ruiz' },
    { date: '2026-04-24', five_am: 'Abraham Diaz', evening: 'Jairo Zelaya', nine_am_1: 'Judith Chasova' },
    { date: '2026-04-25', five_am: 'Timothy Zelaya', evening: 'Daniel Gutierrez', nine_am_1: 'Jasibe Aguilar', nine_am_2: 'Hanai Aguilar' },
    { date: '2026-04-26', five_am: 'Eliab R. Aguilar', evening: 'Abraham Diaz', topic: 'Servicio: Abraham Diaz / Explicación: Ramon Serrano' },

    { date: '2026-04-27', five_am: 'Leonel Marrufo', evening: 'Josue Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-04-28', five_am: 'Esteban Serrano', evening: 'Eliab R. Aguilar', nine_am_1: 'Sibia Marrufo', nine_am_2: 'Maria Gutierrez' },
    { date: '2026-04-29', five_am: 'Manuel Diaz', evening: 'Ignacio Ramirez', nine_am_1: 'Socorro Ruiz', nine_am_2: 'Lucia Zelaya' },
    { date: '2026-04-30', five_am: 'Josue Diaz', evening: 'Melquisedec Serrano', nine_am_1: 'Rhode Adan', topic: 'Servicio Ingles / Doctrina: Elias Ruiz' },
    { date: '2026-05-01', five_am: 'Abraham Diaz', evening: 'Leonel Marrufo', nine_am_1: 'Amisadai Alvarado' },
    { date: '2026-05-02', five_am: 'Abidan Alvarado', evening: 'Oliver Montano', nine_am_1: 'Mareli Montano', nine_am_2: 'Evelin Montano', topic: 'Servicio Niños / Doctrina: Naason Alvarado / Consagración: Isai Hernandez' },
    { date: '2026-05-03', five_am: 'Eliab R. Aguilar', evening: 'Fredy Ruiz Junior', topic: 'Servicio: Fredy Ruiz Junior / Explicación: Leonel Marrufo' },
];

async function updateSchedule() {
    console.log("Starting schedule update for April 2026...");
    
    for (const item of scheduleData) {
        const payload = {
            date: item.date,
            five_am_leader_id: findId(item.five_am),
            nine_am_consecration_leader_id: findId(item.nine_am_1),
            nine_am_doctrine_leader_id: findId(item.nine_am_2),
            evening_leader_ids: item.evening ? [findId(item.evening)] : [],
            topic: item.topic || ''
        };

        console.log(`Updating ${item.date}: ${item.five_am} | ${item.nine_am_1}/${item.nine_am_2} | ${item.evening}`);
        
        const { error } = await supabase
            .from('schedule')
            .upsert(payload, { onConflict: 'date' });

        if (error) {
            console.error(`Error updating ${item.date}:`, error.message);
        }
    }
    
    console.log("Update completed.");
}

updateSchedule();
