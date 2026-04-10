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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Load live profiles
const profiles = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'live_profiles.json'), 'utf8'));

function normalize(name) {
    if (!name) return "";
    return name.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/\./g, "") // Remove periods (e.g. E.E.)
        .replace(/\s+/g, " "); // Normalize spaces
}

function findLiveId(name) {
    if (!name) return null;
    const n = normalize(name);
    
    // Exact match
    let match = profiles.find(p => normalize(p.name) === n);
    if (match) return match.id;
    
    // Partial match (e.g. "Eliab R Aguilar" in "EE Eliab Aguilar")
    const parts = n.split(" ");
    const importantParts = parts.filter(p => p.length > 2); // Avoid matching "r", "de", etc.
    
    match = profiles.find(p => {
        const pn = normalize(p.name);
        return importantParts.every(part => pn.includes(part));
    });
    
    if (match) return match.id;

    // Hardcoded fallbacks for manual discovery
    if (n.includes("lucia zelaya")) return profiles.find(p => p.name.includes("Lucia"))?.id;
    if (n.includes("melquisedec")) return profiles.find(p => p.name.includes("Mequisedec"))?.id;
    if (n.includes("jairo zelaya")) return profiles.find(p => p.name.includes("Jairo"))?.id;
    
    return null;
}

const scheduleData = [
    { date: '2026-03-30', five_am: 'Leonel Marrufo', evening: 'Josue Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-03-31', five_am: 'Esteban Serrano', evening: 'Fredy Ruiz', nine_am_1: 'Sibia Marrufo', nine_am_2: 'Elizabeth Ramirez' },
    { date: '2026-04-01', five_am: 'Manuel Diaz', evening: 'Manuel Gutierrez', nine_am_1: 'Socorro Ruiz', nine_am_2: 'Lucia Zelaya' },
    { date: '2026-04-02', five_am: 'Josue Diaz', evening: 'Gerson Zelaya', nine_am_1: 'Rhode Adan', topic: 'Servicio Ingles / Doctrina: Melquisedec Serrano' },
    { date: '2026-04-03', five_am: 'Abraham Diaz', evening: 'Pablo Santizo', nine_am_1: 'Amisadai Alvarado' },
    { date: '2026-04-04', five_am: 'Abidan Alvarado', evening: 'Oliver Montano', nine_am_1: 'Raama Chasova', nine_am_2: 'Judith Chasova', topic: 'Servicio Niños / Doctrina: Naason Alvarado / Consagración: Isai Hernandez' },
    { date: '2026-04-05', five_am: 'Eliab R. Aguilar', evening: 'Esteban Serrano' },
    
    { date: '2026-04-06', five_am: 'Leonel Marrufo', evening: 'Abraham Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-04-07', five_am: 'Esteban Serrano', evening: 'Eliab R. Aguilar', nine_am_1: 'Maria Gutierrez', nine_am_2: 'Sibia Marrufo' },
    { date: '2026-04-08', five_am: 'Manuel Diaz', evening: 'Ignacio Ramirez', nine_am_1: 'Lucia Zelaya', nine_am_2: 'Socorro Ruiz' },
    { date: '2026-04-09', five_am: 'Josue Diaz', evening: 'Abidan Alvarado', nine_am_1: 'Rhode Adan' },
    { date: '2026-04-10', five_am: 'Abraham Diaz', evening: 'Jairo Zelaya', nine_am_1: 'Judith Chasova' },
    { date: '2026-04-11', five_am: 'Gerson Zelaya', evening: 'Pablo Santizo', nine_am_1: 'Rosa Ramirez', nine_am_2: 'Rebeca Ramirez' },
    { date: '2026-04-12', five_am: 'Eliab R. Aguilar', evening: 'Leonel Marrufo' },

    { date: '2026-04-13', five_am: 'Leonel Marrufo', evening: 'Josue Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-04-14', five_am: 'Esteban Serrano', evening: 'Eliab R. Aguilar', nine_am_1: 'Sibia Marrufo', nine_am_2: 'Maria Gutierrez' },
    { date: '2026-04-15', five_am: 'Manuel Diaz', evening: 'Pablo Santizo', nine_am_1: 'Socorro Ruiz', nine_am_2: 'Lucia Zelaya' },
    { date: '2026-04-16', five_am: 'Josue Diaz', evening: 'Elias Ruiz', nine_am_1: 'Rhode Adan' },
    { date: '2026-04-17', five_am: 'Abraham Diaz', evening: 'Leonel Marrufo', nine_am_1: 'Amisadai Alvarado' },
    { date: '2026-04-18', five_am: 'Elias Ruiz', evening: 'Gabriele Zelaya', nine_am_1: 'Abigail Hernandez', nine_am_2: 'Kerin Hernandez' },
    { date: '2026-04-19', five_am: 'Eliab R. Aguilar', evening: 'Ramon Serrano' },

    { date: '2026-04-20', five_am: 'Leonel Marrufo', evening: 'Abraham Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-04-21', five_am: 'Esteban Serrano', evening: 'Eliab R. Aguilar', nine_am_1: 'Maria Gutierrez', nine_am_2: 'Sibia Marrufo' },
    { date: '2026-04-22', five_am: 'Manuel Diaz', evening: 'Manuel Gutierrez', nine_am_1: 'Lucia Zelaya', nine_am_2: 'Socorro Ruiz' },
    { date: '2026-04-23', five_am: 'Josue Diaz', evening: 'Gerson Zelaya', nine_am_1: 'Rhode Adan' },
    { date: '2026-04-24', five_am: 'Abraham Diaz', evening: 'Jairo Zelaya', nine_am_1: 'Judith Chasova' },
    { date: '2026-04-25', five_am: 'Timothy Zelaya', evening: 'Daniel Gutierrez', nine_am_1: 'Jasibe Aguilar', nine_am_2: 'Hanai Aguilar' },
    { date: '2026-04-26', five_am: 'Eliab R. Aguilar', evening: 'Abraham Diaz' },

    { date: '2026-04-27', five_am: 'Leonel Marrufo', evening: 'Josue Diaz', nine_am_1: 'Edelvira Belloso', nine_am_2: 'Mayra Montano' },
    { date: '2026-04-28', five_am: 'Esteban Serrano', evening: 'Eliab R. Aguilar', nine_am_1: 'Sibia Marrufo', nine_am_2: 'Maria Gutierrez' },
    { date: '2026-04-29', five_am: 'Manuel Diaz', evening: 'Ignacio Ramirez', nine_am_1: 'Socorro Ruiz', nine_am_2: 'Lucia Zelaya' },
    { date: '2026-04-30', five_am: 'Josue Diaz', evening: 'Melquisedec Serrano', nine_am_1: 'Rhode Adan' },
];

async function repair() {
    console.log("Repairing April 2026 schedule with live IDs...");
    
    for (const item of scheduleData) {
        const id5am = findLiveId(item.five_am);
        const id9am1 = findLiveId(item.nine_am_1);
        const id9am2 = findLiveId(item.nine_am_2);
        const idEve = findLiveId(item.evening);

        const payload = {
            date: item.date,
            five_am_leader_id: id5am,
            nine_am_consecration_leader_id: id9am1,
            nine_am_doctrine_leader_id: id9am2,
            evening_leader_ids: idEve ? [idEve] : []
        };

        if (item.topic) payload.topic = item.topic;

        console.log(`Repairing ${item.date}: 
            5AM: ${item.five_am} -> ${id5am}
            9AM: ${item.nine_am_1}/${item.nine_am_2} -> ${id9am1}/${id9am2}
            EVE: ${item.evening} -> ${idEve}`);
        
        const { error } = await supabase
            .from('schedule')
            .upsert(payload, { onConflict: 'date' });

        if (error) console.error(`Error on ${item.date}:`, error.message);
    }
    
    console.log("Repair completed.");
}

repair();
