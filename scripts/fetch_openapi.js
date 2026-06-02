const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabaseUrl = 'https://iiilenevhepdrrqbgvey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaWxlbmV2aGVwZHJycWJndmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTcwNDQzOCwiZXhwIjoyMDg3MjgwNDM4fQ.xlcMKIMdHEGCyfEc2SYmwgA697_G760u9pOWf3ZKk64';

async function run() {
    console.log('Fetching OpenAPI spec from Supabase...');
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });

    const spec = await response.json();
    console.log('Paths in OpenAPI spec:');
    const rpcPaths = Object.keys(spec.paths).filter(p => p.startsWith('/rpc/'));
    console.log(rpcPaths);
}

run();
