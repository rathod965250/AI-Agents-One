import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uilnynmclpohscpsequg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function getFullAgent() {
  try {
    console.log('Fetching a complete agent with related data...');
    
    // Get the first agent with related data
    const { data: agents, error } = await supabase
      .from('ai_agents')
      .select(`
        *,
        profiles (
          username,
          full_name,
          avatar_url
        ),
        agent_reviews (
          id,
          rating,
          content,
          created_at,
          profiles (
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .limit(1);

    if (error) throw error;
    
    if (!agents || agents.length === 0) {
      console.log('No agents found in the database.');
      return;
    }

    const agent = agents[0];
    
    console.log('\n=== Complete Agent Data ===');
    console.log(JSON.stringify(agent, null, 2));
    
    // Check for required UI fields
    const requiredFields = {
      // Basic Info
      'name': 'string',
      'tagline': 'string',
      'description': 'string',
      'category': 'string',
      'website_url': 'string',
      'pricing_type': 'string',
      
      // Features & Details
      'features': 'array',
      'technical_specs': 'array',
      'gallery': 'array',
      'integrations': 'array',
      'case_studies': 'array',
      
      // Pricing
      'pricing': 'object',
      
      // Reviews & Ratings
      'average_rating': 'number',
      'total_reviews': 'number',
      'agent_reviews': 'array'
    };
    
    console.log('\n=== Field Analysis ===');
    Object.entries(requiredFields).forEach(([field, type]) => {
      const value = agent[field];
      let status = '❌ Missing';
      
      if (value !== undefined && value !== null) {
        if ((type === 'array' && Array.isArray(value) && value.length > 0) ||
            (type === 'object' && value && Object.keys(value).length > 0) ||
            (type === 'string' && value.trim() !== '') ||
            (type === 'number' && !isNaN(value))) {
          status = '✅ Present';
        } else {
          status = '⚠️  Empty';
        }
      }
      
      console.log(`${status.padEnd(10)} ${field} (${type})`);
    });
    
  } catch (error) {
    console.error('Error fetching agent data:', error);
  }
}

getFullAgent();
