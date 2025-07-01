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

async function updateAllLogos() {
  console.log('🔧 Updating all agents with logo URLs...');
  
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
    
    // Update each agent with a logo URL
    for (const agent of agents) {
      const logoUrl = generateLogoUrl(agent.slug);
      
      // Skip if already has a logo URL
      if (agent.logo_url) {
        console.log(`⏭️  Skipping ${agent.name} (already has logo)`);
        continue;
      }
      
      console.log(`🔄 Updating ${agent.name}...`);
      
      const { error: updateError } = await supabase
        .from('ai_agents')
        .update({ logo_url: logoUrl })
        .eq('id', agent.id);
      
      if (updateError) {
        console.error(`❌ Error updating ${agent.name}:`, updateError);
      } else {
        console.log(`✅ Updated ${agent.name} with logo URL: ${logoUrl}`);
      }
    }
    
    console.log('\n🎉 Database update completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Upload your logo files to the "agent-logos" bucket');
    console.log('2. Use these exact filenames:');
    
    agents.forEach(agent => {
      console.log(`   - ${agent.slug}-logo.png`);
    });
    
    console.log('\n3. The frontend will automatically display the logos');
    console.log('4. If a logo fails to load, it will show a placeholder');
    
  } catch (err) {
    console.error('💥 Exception:', err);
  }
}

updateAllLogos(); 