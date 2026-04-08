
import { createClient } from '@supabase/supabase-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const namesToHide = [
    'MULTIMEDIA RODEO', 'JUAN PEREZ', 'KARINA', 'JOSUE DÍAZ', 
    'NIKITA CHASOV', 'JUDITH CHASOVA', 'LIDIA CHASOVA', 'NOA CHASOVA', 'RAAMA CHASOVA',
    'PABLO SANTIZO', 'ISABEL SANTIZO', 'JARED GANBOA', 'JASIBE AGUILAR', 
    'CALEB SERVANTEZ', 'SARAÍ HERNÁNDEZ', 'MEQUISEDEC SERRANO', 'MAYRA MONTANO', 
    'KEREN HERNÁNDEZ', 'ESTEBAN SERRANO', 'MIGUEL RAMÍREZ', 'JORGE MOLINA', 
    'VERONICA PÉREZ', 'HANAÍ AGUILAR', 'JOSÉ PÉREZ', 'MIGUEL HERNÁNDEZ', 
    'ISAI HERNANDEZ', 'BELEN RUÍZ', 'NAASON ALVARADO'
];

async function sanitizeDatabase() {
  console.log(`Iniciando sanitización de ${namesToHide.length} perfiles...`);
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      hide_from_attendance: true, 
      hide_from_membership_count: true 
    })
    .in('name', namesToHide);

  if (error) {
    console.error('Error actualizando perfiles:', error);
  } else {
    console.log('Sanitización completada con éxito.');
  }
}

sanitizeDatabase();
