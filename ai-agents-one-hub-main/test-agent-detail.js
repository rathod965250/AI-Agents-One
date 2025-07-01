const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://uilnynmclpohscpsequg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0'
);

async function testAgentQuery() {
  console.log('🔍 Testing agent query with slug: dalle-creative-studio');
  
  try {
    const { data, error } = await supabase
      .from('ai_agents')
      .select(`
        id, name, slug, website_url, category, pricing_type, status, 
        total_upvotes, total_reviews, average_rating, view_count, 
        developer, description, tagline, logo_url, homepage_image_url,
        pricing_details, features, integrations, technical_specs, "Use Cases"
      `)
      .eq('slug', 'dalle-creative-studio')
      .single();
    
    console.log('📊 Query result:', { data, error });
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    if (!data) {
      console.log('⚠️ No agent found');
      return;
    }
    
    console.log('✅ Agent found:', data.name);
    console.log('📋 Agent data:', JSON.stringify(data, null, 2));
    
  } catch (err) {
    console.error('💥 Exception:', err);
  }
}

testAgentQuery(); 