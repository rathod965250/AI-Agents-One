import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uilnynmclpohscpsequg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function getAgentSchema() {
  try {
    // Get a sample agent to see the structure
    const { data: sampleAgent, error } = await supabase
      .from('ai_agents')
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;

    console.log('=== AI Agent Schema ===');
    console.log('Fields and their types:');
    
    // Log each field and its type
    Object.entries(sampleAgent).forEach(([key, value]) => {
      console.log(`${key}: ${typeof value}`, Array.isArray(value) ? '(Array)' : '');
    });

    // Get column information
    const { data: columnInfo } = await supabase
      .rpc('get_table_columns_info', { table_name: 'ai_agents' })
      .then(res => res.data || []);

    if (columnInfo && columnInfo.length > 0) {
      console.log('\n=== Column Details ===');
      console.table(columnInfo);
    }

  } catch (error) {
    console.error('Error getting schema:', error);
  }
}

getAgentSchema();
