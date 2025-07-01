const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://uilnynmclpohscpsequg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0'
);

async function addLogoColumn() {
  console.log('🔧 Adding logo_url column to ai_agents table...');
  
  try {
    // First, check if the column already exists
    const { data: testData, error: testError } = await supabase
      .from('ai_agents')
      .select('logo_url')
      .limit(1);
    
    if (testError && testError.message.includes('column "logo_url" does not exist')) {
      console.log('❌ logo_url column does not exist. Please run this SQL in your Supabase dashboard:');
      console.log(`
        ALTER TABLE public.ai_agents 
        ADD COLUMN IF NOT EXISTS logo_url TEXT;
        
        COMMENT ON COLUMN public.ai_agents.logo_url IS 'URL to the agent logo stored in Supabase storage bucket "agent-logos"';
        
        CREATE INDEX IF NOT EXISTS idx_ai_agents_logo_url ON public.ai_agents(logo_url);
      `);
      return;
    }
    
    if (testError) {
      console.error('❌ Error checking column:', testError);
      return;
    }
    
    console.log('✅ logo_url column already exists!');
    
    // Show current state
    const { data: agents, error } = await supabase
      .from('ai_agents')
      .select('name, slug, logo_url')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching agents:', error);
      return;
    }
    
    console.log('\n📊 Current logo status:');
    agents.forEach(agent => {
      const hasLogo = agent.logo_url ? '✅' : '❌';
      console.log(`${hasLogo} ${agent.name} (${agent.slug})`);
    });
    
    console.log('\n🎯 Ready to use! Upload logos to your "agent-logos" bucket and update the logo_url column.');
    
  } catch (err) {
    console.error('💥 Exception:', err);
  }
}

addLogoColumn(); 