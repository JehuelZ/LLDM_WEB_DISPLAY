import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iiilenevhepdrrqbgvey.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    console.log("Fetching all profiles...");
    const { data: profiles, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.error("Error fetching profiles:", error);
        return;
    }

    console.log(`Found ${profiles.length} profiles.`);

    // Find duplicates by email and Jairo's profiles
    const emailCounts = {};
    for (const p of profiles) {
        if (!emailCounts[p.email]) {
            emailCounts[p.email] = [];
        }
        emailCounts[p.email].push(p);
    }

    for (const [email, userProfiles] of Object.entries(emailCounts)) {
        if (userProfiles.length > 1) {
            console.log(`DUPLICATE EMAIL FOUND: ${email}`);
            console.log(userProfiles.map(p => `  - ID: ${p.id}, Name: ${p.name}, Role: ${p.role}, Avatar: ${p.avatar}`).join('\n'));
        }
    }

    console.log("\nSearching for Jairo:");
    const jairoProfiles = profiles.filter(p => p.name?.toLowerCase().includes('jairo') || p.email?.toLowerCase().includes('jairo'));
    jairoProfiles.forEach(p => {
        console.log(`- ID: ${p.id}, Email: ${p.email}, Name: ${p.name}, Role: ${p.role}, Avatar: ${p.avatar}`);
    });
}

main();
