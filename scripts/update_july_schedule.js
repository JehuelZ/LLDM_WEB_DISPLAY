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

// July 2026 9AM Prayer Schedule
const calendarData = [
  // Week 1 (includes end of June and beginning of July)
  { date: '2026-06-29', leaders: ['Edelvira Belloso', 'Mayra Montano'] },
  { date: '2026-06-30', leaders: ['Maria Gutierrez', 'Sibia Marrufo'] },
  { date: '2026-07-01', leaders: ['Lucia Zelaya', 'Socorro Ruiz'] },
  { date: '2026-07-02', leaders: ['Rhode Adan'] },
  { date: '2026-07-03', leaders: ['Judith Chasova'] },
  { date: '2026-07-04', leaders: ['Abigail Hernandez', 'Kerin Hernández'] },
  // Week 2
  { date: '2026-07-06', leaders: ['Edelvira Belloso', 'Mayra Montano'] },
  { date: '2026-07-07', leaders: ['Sibia Marrufo', 'Maria Gutierrez'] },
  { date: '2026-07-08', leaders: ['Socorro Ruiz', 'Lucia Zelaya'] },
  { date: '2026-07-09', leaders: ['Rhode Adan'] },
  { date: '2026-07-10', leaders: ['Amisadai Alvarado'] },
  { date: '2026-07-11', leaders: ['Rosa Ramirez', 'Rebeca Ramirez'] },
  // Week 3
  { date: '2026-07-13', leaders: ['Edelvira Belloso', 'Mayra Montano'] },
  { date: '2026-07-14', leaders: ['Maria Gutierrez', 'Sibia Marrufo'] },
  { date: '2026-07-15', leaders: ['Lucia Zelaya', 'Socorro Ruiz'] },
  { date: '2026-07-16', leaders: ['Rhode Adan'] },
  { date: '2026-07-17', leaders: ['Judith Chasova'] },
  { date: '2026-07-18', leaders: ['Jasibe Aguilar', 'Hanai Aguilar'] },
  // Week 4
  { date: '2026-07-20', leaders: ['Edelvira Belloso', 'Mayra Montano'] },
  { date: '2026-07-21', leaders: ['Sibia Marrufo', 'Maria Gutierrez'] },
  { date: '2026-07-22', leaders: ['Socorro Ruiz', 'Lucia Zelaya'] },
  { date: '2026-07-23', leaders: ['Rhode Adan'] },
  { date: '2026-07-24', leaders: ['Amisadai Alvarado'] },
  { date: '2026-07-25', leaders: ['Raama Chasova', 'Judith Chasova'] },
  // Week 5
  { date: '2026-07-27', leaders: ['Edelvira Belloso', 'Mayra Montano'] },
  { date: '2026-07-28', leaders: ['Maria Gutierrez', 'Sibia Marrufo'] },
  { date: '2026-07-29', leaders: ['Lucia Zelaya', 'Socorro Ruiz'] },
  { date: '2026-07-30', leaders: ['Rhode Adan'] },
  { date: '2026-07-31', leaders: ['Judith Chasova'] },
  { date: '2026-08-01', leaders: ['Abigail Hernandez', 'Kerin Hernandez'] }
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

    // 2. Process each day
    for (const item of calendarData) {
        const { date, leaders } = item;
        let matchedIds = [];
        let hasMismatch = false;

        for (const leaderName of leaders) {
            const norm = normalizeName(leaderName);
            const matched = profileMap.get(norm);

            if (matched) {
                matchedIds.push(matched.id);
            } else {
                hasMismatch = true;
                // Find candidates for helpful reporting
                const candidates = profiles
                    .filter(p => {
                        const score = levenshteinDistance(normalizeName(p.name), norm);
                        return score <= 2; // Close matches
                    })
                    .map(p => p.name);

                report.mismatches.push({
                    date,
                    inputName: leaderName,
                    candidates
                });
            }
        }

        if (hasMismatch) {
            report.skipped.push({
                date,
                leaders,
                reason: 'Uno o más nombres no coinciden exactamente en la base de datos.'
            });
            continue;
        }

        // We have matched all leaders for this day
        const id1 = matchedIds[0];
        const id2 = matchedIds[1] || id1; // If only 1 leader, set both to the same ID

        // Check if schedule entry already exists for this date
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
            // Update existing entry
            const { error: updateError } = await supabase
                .from('schedule')
                .update({
                    nine_am_consecration_leader_id: id1,
                    nine_am_doctrine_leader_id: id2,
                    nine_am_time: '09:00 AM',
                    nine_am_end_time: '10:15 AM'
                })
                .eq('id', existing.id);

            if (updateError) {
                console.error(`Error updating schedule for date ${date}:`, updateError);
            } else {
                report.updated.push({ date, leaders });
            }
        } else {
            // Insert new entry
            const { error: insertError } = await supabase
                .from('schedule')
                .insert({
                    date,
                    nine_am_consecration_leader_id: id1,
                    nine_am_doctrine_leader_id: id2,
                    nine_am_time: '09:00 AM',
                    nine_am_end_time: '10:15 AM',
                    nine_am_language: 'es'
                });

            if (insertError) {
                console.error(`Error inserting schedule for date ${date}:`, insertError);
            } else {
                report.updated.push({ date, leaders });
            }
        }
    }

    // Print final report
    console.log('\n================ REPORT ================');
    console.log(`Días actualizados correctamente (${report.updated.length}):`);
    report.updated.forEach(u => console.log(`  - ${u.date}: ${u.leaders.join(' | ')}`));

    console.log(`\nDías omitidos por errores de escritura (${report.skipped.length}):`);
    report.skipped.forEach(s => console.log(`  - ${s.date}: ${s.leaders.join(' | ')}`));

    console.log('\nErrores específicos encontrados:');
    report.mismatches.forEach(m => {
        console.log(`  - Fecha: ${m.date}`);
        console.log(`    Nombre en imagen: "${m.inputName}"`);
        console.log(`    Sugerencias en DB: ${m.candidates.length > 0 ? m.candidates.map(c => `"${c}"`).join(', ') : 'Ninguno'}`);
    });
    console.log('========================================');

    // Save report to disk as JSON for reference
    fs.writeFileSync(path.join(__dirname, '../july_import_report.json'), JSON.stringify(report, null, 2));
}

// Simple Levenshtein distance for spelling suggestions
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

run();
