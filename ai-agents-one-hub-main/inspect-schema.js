import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uilnynmclpohscpsequg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function inspectSchema() {
  try {
    // Get column information for ai_agents table
    const { data: columns, error } = await supabase
      .rpc('get_columns_info', { table_name: 'ai_agents' });
    
    if (error) throw error;
    
    console.log('=== AI Agents Table Schema ===');
    console.table(columns);
    
    // Get sample data to understand content
    const { data: sample } = await supabase
      .from('ai_agents')
      .select('*')
      .limit(1)
      .single();
      
    console.log('\n=== Sample Data ===');
    console.log(sample);
    
  } catch (error) {
    console.error('Error inspecting schema:', error);
  }
}

inspectSchema();
