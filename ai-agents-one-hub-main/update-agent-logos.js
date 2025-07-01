const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://uilnynmclpohscpsequg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0'
);

const SUPABASE_URL = "https://uilnynmclpohscpsequg.supabase.co";
const BUCKET_NAME = "agent-logos";

function generateLogoUrl(agentSlug, extension = 'png') {
  const filename = `${agentSlug}-logo.${extension}`;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;
}

async function updateAgentLogos() {
  console.log('🔍 Fetching all agents...');
  
  try {
    // Get all agents
    const { data: agents, error } = await supabase
      .from('ai_agents')
      .select('id, name, slug, logo_url')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching agents:', error);
      return;
    }
    
    console.log(`📋 Found ${agents.length} agents`);
    
    // Show current state
    console.log('\n📊 Current logo status:');
    agents.forEach(agent => {
      const hasLogo = agent.logo_url ? '✅' : '❌';
      console.log(`${hasLogo} ${agent.name} (${agent.slug})`);
      if (agent.logo_url) {
        console.log(`   Current: ${agent.logo_url}`);
      }
    });
    
    // Generate example URLs
    console.log('\n🔗 Example logo URLs for each agent:');
    agents.forEach(agent => {
      const logoUrl = generateLogoUrl(agent.slug);
      console.log(`${agent.name}: ${logoUrl}`);
    });
    
    // Interactive update
    console.log('\n💡 To update an agent with a logo URL:');
    console.log('1. Upload the logo to your "agent-logos" bucket with filename: [agent-slug]-logo.png');
    console.log('2. Use the URL format shown above');
    console.log('3. Update the database with:');
    console.log(`
    await supabase
      .from('ai_agents')
      .update({ logo_url: '${generateLogoUrl('example-agent')}' })
      .eq('slug', 'example-agent');
    `);
    
    // Example: Update DALL-E Creative Studio
    console.log('\n🎯 Example: Update DALL-E Creative Studio');
    const dalleLogoUrl = generateLogoUrl('dalle-creative-studio');
    console.log(`Logo URL: ${dalleLogoUrl}`);
    console.log(`SQL: UPDATE ai_agents SET logo_url = '${dalleLogoUrl}' WHERE slug = 'dalle-creative-studio';`);
    
  } catch (err) {
    console.error('💥 Exception:', err);
  }
}

updateAgentLogos(); 