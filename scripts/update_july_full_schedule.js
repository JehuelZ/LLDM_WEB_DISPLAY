const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

// Complete schedule for 5AM and 7PM (Evening) slots for July 2026
const calendarData = [
  // Week 1
  {
    date: '2026-06-29',
    fiveAm: 'Leonel Marrufo',
    evening: { type: 'regular', leaders: ['Abraham Díaz'] }
  },
  {
    date: '2026-06-30',
    fiveAm: 'Esteban Serrano',
    evening: { type: 'regular', leaders: ['Eliab R. Aguilar'] }
  },
  {
    date: '2026-07-01',
    fiveAm: 'Manuel Díaz',
    evening: { type: 'regular', leaders: ['Manuel Gutierrez'] }
  },
  {
    date: '2026-07-02',
    fiveAm: 'Josué Díaz',
    evening: { type: 'thursday_regular', service: 'Gerson Zelaya', doctrine: 'Freddy Ruiz Sr.' }
  },
  {
    date: '2026-07-03',
    fiveAm: 'Abraham Díaz',
    evening: { type: 'regular', leaders: ['Pablo Santizo'] }
  },
  {
    date: '2026-07-04',
    fiveAm: 'Timothy Zelaya',
    evening: { type: 'regular', leaders: ['Daniel Gutierrez'] }
  },
  {
    date: '2026-07-05',
    fiveAm: 'Eliab R. Aguilar',
    evening: { type: 'sunday_regular', service: 'Josué Díaz', explanation: 'Leonel Marrufo' }
  },
  // Week 2
  {
    date: '2026-07-06',
    fiveAm: 'Leonel Marrufo',
    evening: { type: 'regular', leaders: ['Josué Díaz'] }
  },
  {
    date: '2026-07-07',
    fiveAm: 'Esteban Serrano',
    evening: { type: 'regular', leaders: ['Eliab R. Aguilar'] }
  },
  {
    date: '2026-07-08',
    fiveAm: 'Manuel Díaz',
    evening: { type: 'regular', leaders: ['Ignacio Ramírez'] }
  },
  {
    date: '2026-07-09',
    fiveAm: 'Josué Díaz',
    evening: { type: 'thursday_english', service: 'Melquisedec Serrano', doctrine: 'Elias Ruiz' }
  },
  {
    date: '2026-07-10',
    fiveAm: 'Abraham Díaz',
    evening: { type: 'regular', leaders: ['Jairo Zelaya'] }
  },
  {
    date: '2026-07-11',
    fiveAm: 'Elías Ruiz',
    evening: { type: 'saturday_children', service: 'Isai Hernández', doctrine: 'Oliver Montano', consecration: 'Gabrielle Zelaya' }
  },
  {
    date: '2026-07-12',
    fiveAm: 'Eliab R. Aguilar',
    evening: { type: 'sunday_regular', service: 'Abraham Díaz', explanation: 'Ramon Serrano' }
  },
  // Week 3
  {
    date: '2026-07-13',
    fiveAm: 'Leonel Marrufo',
    evening: { type: 'regular', leaders: ['Abraham Díaz'] }
  },
  {
    date: '2026-07-14',
    fiveAm: 'Esteban Serrano',
    evening: { type: 'regular', leaders: ['Eliab R. Aguilar'] }
  },
  {
    date: '2026-07-15',
    fiveAm: 'Manuel Díaz',
    evening: { type: 'regular', leaders: ['Manuel Gutierrez'] }
  },
  {
    date: '2026-07-16',
    fiveAm: 'Josué Díaz',
    evening: { type: 'thursday_regular', service: 'Gerson Zelaya', doctrine: 'Freddy Ruiz Sr.' }
  },
  {
    date: '2026-07-17',
    fiveAm: 'Abraham Díaz',
    evening: { type: 'regular', leaders: ['Pablo Santizo'] }
  },
  {
    date: '2026-07-18',
    fiveAm: 'Gerson Zelaya',
    evening: { type: 'regular', leaders: ['Jairo Zelaya'] }
  },
  {
    date: '2026-07-19',
    fiveAm: 'Eliab R. Aguilar',
    evening: { type: 'sunday_regular', service: 'Freddy Ruiz Jr.', explanation: 'Freddy Ruiz Sr.' }
  },
  // Week 4
  {
    date: '2026-07-20',
    fiveAm: 'Leonel Marrufo',
    evening: { type: 'regular', leaders: ['Josué Díaz'] }
  },
  {
    date: '2026-07-21',
    fiveAm: 'Esteban Serrano',
    evening: { type: 'regular', leaders: ['Eliab R. Aguilar'] }
  },
  {
    date: '2026-07-22',
    fiveAm: 'Manuel Díaz',
    evening: { type: 'regular', leaders: ['Ignacio Ramírez'] }
  },
  {
    date: '2026-07-23',
    fiveAm: 'Josué Díaz',
    evening: { type: 'thursday_english', service: 'Elias Ruiz', doctrine: 'Melquisedec Serrano' }
  },
  {
    date: '2026-07-24',
    fiveAm: 'Abraham Díaz',
    evening: { type: 'regular', leaders: ['Jairo Zelaya'] }
  },
  {
    date: '2026-07-25',
    fiveAm: 'Elías Ruiz',
    evening: { type: 'saturday_children', service: 'Gabrielle Zelaya', doctrine: 'Isai Hernández', consecration: 'Oliver Montano' }
  },
  {
    date: '2026-07-26',
    fiveAm: 'Eliab R. Aguilar',
    evening: { type: 'sunday_regular', service: 'Jairo Zelaya', explanation: 'Ramon Serrano' }
  },
  // Week 5
  {
    date: '2026-07-27',
    fiveAm: 'Leonel Marrufo',
    evening: { type: 'regular', leaders: ['Abraham Díaz'] }
  },
  {
    date: '2026-07-28',
    fiveAm: 'Esteban Serrano',
    evening: { type: 'regular', leaders: ['Eliab R. Aguilar'] }
  },
  {
    date: '2026-07-29',
    fiveAm: 'Manuel Díaz',
    evening: { type: 'regular', leaders: ['Manuel Gutierrez'] }
  },
  {
    date: '2026-07-30',
    fiveAm: 'Josué Díaz',
    evening: { type: 'thursday_regular', service: 'Gerson Zelaya', doctrine: 'Freddy Ruiz Sr.' }
  },
  {
    date: '2026-07-31',
    fiveAm: 'Abraham Díaz',
    evening: { type: 'regular', leaders: ['Pablo Santizo'] }
  },
  {
    date: '2026-08-01',
    fiveAm: 'Timothy Zelaya',
    evening: { type: 'regular', leaders: ['Daniel Gutierrez'] }
  },
  {
    date: '2026-08-02',
    fiveAm: 'Eliab R. Aguilar',
    evening: { type: 'sunday_regular', service: 'Josué Díaz', explanation: 'Leonel Marrufo' }
  }
];

function normalizeName(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function resolveAlias(name) {
  const aliases = {
    'eliab r. aguilar': 'e.e. eliab r. aguilar',
    'freddy ruiz sr': 'fredy ruiz sr.',
    'freddy ruiz sr.': 'fredy ruiz sr.',
    'freddy ruiz jr': 'fredy ruiz jr.',
    'freddy ruiz jr.': 'fredy ruiz jr.',
    'gabrielle zelaya': 'gabriele zelaya'
  };
  const norm = normalizeName(name);
  return aliases[norm] ? normalizeName(aliases[norm]) : norm;
}

// Levenshtein distance for spelling suggestions
function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

async function run() {
    // 1. Fetch profiles to build map
    const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('id, name');

    if (pError) {
        console.error('Error fetching profiles:', pError);
        process.exit(1);
    }

    console.log(`Loaded ${profiles.length} profiles from database.`);

    const profileMap = new Map();
    profiles.forEach(p => {
        profileMap.set(normalizeName(p.name), p);
    });

    const report = {
        updated: [],
        skipped: [],
        mismatches: []
    };

    // Helper to resolve and match name, logging mismatches
    function resolveMember(name, date, roleLabel) {
        if (!name) return null;
        const norm = resolveAlias(name);
        const matched = profileMap.get(norm);
        if (matched) {
            return matched.id;
        } else {
            // Find candidates for spelling suggestions
            const candidates = profiles
                .filter(p => levenshteinDistance(normalizeName(p.name), norm) <= 2)
                .map(p => p.name);

            report.mismatches.push({
                date,
                role: roleLabel,
                inputName: name,
                candidates
            });
            return null;
        }
    }

    // 2. Process each day
    for (const item of calendarData) {
        const { date, fiveAm, evening } = item;
        let dayHasMismatch = false;

        // Resolve 5AM
        const fiveAmId = resolveMember(fiveAm, date, '5AM Leader');
        if (fiveAm && !fiveAmId) {
            dayHasMismatch = true;
        }

        // Resolve Evening leaders based on type
        let eveningPayload = {};
        if (evening.type === 'regular') {
            const leaderName = evening.leaders[0];
            const leaderId = resolveMember(leaderName, date, '7PM Leader');
            if (leaderName && !leaderId) {
                dayHasMismatch = true;
            }
            eveningPayload = {
                evening_leader_ids: leaderId ? [leaderId] : [],
                evening_doctrine_leader_id: null,
                evening_consecration_leader_id: null,
                evening_service_type: 'regular',
                evening_service_language: 'es',
                evening_custom_label: ''
            };
        } else if (evening.type === 'thursday_regular') {
            const serviceId = resolveMember(evening.service, date, '7PM Thursday Service');
            const doctrineId = resolveMember(evening.doctrine, date, '7PM Thursday Doctrine');
            if ((evening.service && !serviceId) || (evening.doctrine && !doctrineId)) {
                dayHasMismatch = true;
            }
            eveningPayload = {
                evening_leader_ids: serviceId ? [serviceId] : [],
                evening_doctrine_leader_id: doctrineId || null,
                evening_consecration_leader_id: null,
                evening_service_type: 'doctrine',
                evening_service_language: 'es',
                evening_custom_label: ''
            };
        } else if (evening.type === 'thursday_english') {
            const serviceId = resolveMember(evening.service, date, '7PM Thursday English Service');
            const doctrineId = resolveMember(evening.doctrine, date, '7PM Thursday English Doctrine');
            if ((evening.service && !serviceId) || (evening.doctrine && !doctrineId)) {
                dayHasMismatch = true;
            }
            eveningPayload = {
                evening_leader_ids: serviceId ? [serviceId] : [],
                evening_doctrine_leader_id: doctrineId || null,
                evening_consecration_leader_id: null,
                evening_service_type: 'doctrine',
                evening_service_language: 'en',
                evening_custom_label: 'Servicio Inglés'
            };
        } else if (evening.type === 'sunday_regular') {
            const serviceId = resolveMember(evening.service, date, '7PM Sunday Service');
            const explanationId = resolveMember(evening.explanation, date, '7PM Sunday Explanation');
            if ((evening.service && !serviceId) || (evening.explanation && !explanationId)) {
                dayHasMismatch = true;
            }
            eveningPayload = {
                evening_leader_ids: serviceId ? [serviceId] : [],
                evening_doctrine_leader_id: explanationId || null,
                evening_consecration_leader_id: null,
                evening_service_type: 'doctrine',
                evening_service_language: 'es',
                evening_custom_label: ''
            };
        } else if (evening.type === 'saturday_children') {
            const serviceId = resolveMember(evening.service, date, '7PM Saturday Children Service');
            const doctrineId = resolveMember(evening.doctrine, date, '7PM Saturday Children Doctrine');
            const consecrationId = resolveMember(evening.consecration, date, '7PM Saturday Children Consecration');
            if ((evening.service && !serviceId) || (evening.doctrine && !doctrineId) || (evening.consecration && !consecrationId)) {
                dayHasMismatch = true;
            }
            eveningPayload = {
                evening_leader_ids: serviceId ? [serviceId] : [],
                evening_doctrine_leader_id: doctrineId || null,
                evening_consecration_leader_id: consecrationId || null,
                evening_service_type: 'children',
                evening_service_language: 'es',
                evening_custom_label: 'Servicio Niños'
            };
        }

        // If any slot has a mismatch, we skip updating this day
        if (dayHasMismatch) {
            report.skipped.push({
                date,
                fiveAm,
                evening,
                reason: 'Uno o más nombres de encargados no coinciden con la base de datos.'
            });
            continue;
        }

        // Prepare database update payload
        const updatePayload = {
            five_am_leader_id: fiveAmId || null,
            five_am_time: '05:00 AM',
            five_am_end_time: '06:15 AM',
            five_am_language: 'es',
            ...eveningPayload
        };

        // Query if date exists in schedule
        const { data: existing, error: fetchError } = await supabase
            .from('schedule')
            .select('id')
            .eq('date', date)
            .maybeSingle();

        if (fetchError) {
            console.error(`Error querying schedule for date ${date}:`, fetchError);
            continue;
        }

        if (existing) {
            const { error: updateError } = await supabase
                .from('schedule')
                .update(updatePayload)
                .eq('id', existing.id);

            if (updateError) {
                console.error(`Error updating schedule for date ${date}:`, updateError);
            } else {
                report.updated.push({ date, fiveAm, evening });
            }
        } else {
            const { error: insertError } = await supabase
                .from('schedule')
                .insert({
                    date,
                    ...updatePayload
                });

            if (insertError) {
                console.error(`Error inserting schedule for date ${date}:`, insertError);
            } else {
                report.updated.push({ date, fiveAm, evening });
            }
        }
    }

    // Print final report
    console.log('\n================ REPORT ================');
    console.log(`Días actualizados correctamente (${report.updated.length}):`);
    report.updated.forEach(u => {
        console.log(`  - ${u.date}:`);
        console.log(`    5AM: ${u.fiveAm}`);
        console.log(`    7PM: ${JSON.stringify(u.evening)}`);
    });

    console.log(`\nDías omitidos por errores de escritura (${report.skipped.length}):`);
    report.skipped.forEach(s => {
        console.log(`  - ${s.date}:`);
        console.log(`    5AM: ${s.fiveAm}`);
        console.log(`    7PM: ${JSON.stringify(s.evening)}`);
    });

    console.log('\nErrores específicos de escritura encontrados:');
    report.mismatches.forEach(m => {
        console.log(`  - Fecha: ${m.date} [Rol: ${m.role}]`);
        console.log(`    Nombre en imagen: "${m.inputName}"`);
        console.log(`    Sugerencias en DB: ${m.candidates.length > 0 ? m.candidates.map(c => `"${c}"`).join(', ') : 'Ninguno'}`);
    });
    console.log('========================================');

    fs.writeFileSync(path.join(__dirname, '../july_full_import_report.json'), JSON.stringify(report, null, 2));
}

run();
