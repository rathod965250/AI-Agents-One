import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uilnynmclpohscpsequg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function getSampleAgent() {
  try {
    console.log('Fetching a sample agent...');
    
    // Get the first agent
    const { data: agents, error } = await supabase
      .from('ai_agents')
      .select('*')
      .limit(1);

    if (error) throw error;
    
    if (!agents || agents.length === 0) {
      console.log('No agents found in the database.');
      return;
    }

    const agent = agents[0];
    
    console.log('\n=== Sample Agent Data ===');
    console.log(JSON.stringify(agent, null, 2));
    
    // Check for required fields from the UI
    const requiredFields = [
      'name', 
      'tagline', 
      'description', 
      'features', 
      'pricing',
      'technical_specs',
      'gallery',
      'average_rating',
      'total_reviews'
    ];
    
    console.log('\n=== Missing Fields ===');
    const missingFields = requiredFields.filter(field => {
      const value = agent[field];
      return value === undefined || value === null || 
             (Array.isArray(value) && value.length === 0) ||
             (typeof value === 'string' && value.trim() === '');
    });
    
    if (missingFields.length > 0) {
      console.log('The following fields are missing or empty:');
      missingFields.forEach(field => console.log(`- ${field}`));
    } else {
      console.log('All required fields are present!');
    }
    
  } catch (error) {
    console.error('Error fetching sample agent:', error);
  }
}

getSampleAgent();
