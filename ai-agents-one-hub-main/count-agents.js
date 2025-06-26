import { createClient } from '@supabase/supabase-js';

// Initialize the client with your Supabase URL and anon key
const supabaseUrl = 'https://uilnynmclpohscpsequg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function countAgents() {
  try {
    console.log('Counting agents in ai_agents table...');
    
    // Query to count all rows in ai_agents table
    const { count, error } = await supabase
      .from('ai_agents')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error counting agents:', error);
      return;
    }
    
    console.log(`✅ Found ${count} agents in the ai_agents table`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
countAgents();
