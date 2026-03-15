
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMembers() {
  const { data: members, error } = await supabase
    .from('members')
    .select('name, gender, category, member_group');

  if (error) {
    console.error(error);
    return;
  }

  const groups = {};
  const categories = {};
  const combinations = {};

  members.forEach(m => {
    const g = m.member_group || 'NULL';
    const c = m.category || 'NULL';
    const gen = m.gender || 'NULL';
    
    groups[g] = (groups[g] || 0) + 1;
    categories[c] = (categories[c] || 0) + 1;
    
    const combo = `${gen} | ${c} | ${g}`;
    combinations[combo] = (combinations[combo] || 0) + 1;
  });

  console.log('--- Groups ---');
  console.log(groups);
  console.log('--- Categories ---');
  console.log(categories);
  console.log('--- Combinations ---');
  Object.entries(combinations).sort().forEach(([k, v]) => {
    console.log(`${k}: ${v}`);
  });
}

checkMembers();
