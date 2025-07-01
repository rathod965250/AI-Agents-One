const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://uilnynmclpohscpsequg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0'
);

async function addLogoUrlColumn() {
  console.log('🔧 Adding logo_url column to ai_agents table...');
  
  try {
    // Add the logo_url column
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.ai_agents 
        ADD COLUMN IF NOT EXISTS logo_url TEXT;
        
        COMMENT ON COLUMN public.ai_agents.logo_url IS 'URL to the agent logo stored in Supabase storage bucket "agent-logos"';
        
        CREATE INDEX IF NOT EXISTS idx_ai_agents_logo_url ON public.ai_agents(logo_url);
      `
    });
    
    if (alterError) {
      console.error('❌ Error adding column:', alterError);
      
      // Try alternative approach using direct SQL
      console.log('🔄 Trying alternative approach...');
      const { error: directError } = await supabase
        .from('ai_agents')
        .select('id')
        .limit(1);
      
      if (directError) {
        console.error('❌ Database connection issue:', directError);
        return;
      }
      
      console.log('✅ Database connection successful');
      console.log('📝 Please run the following SQL manually in your Supabase dashboard:');
      console.log(`
        ALTER TABLE public.ai_agents 
        ADD COLUMN IF NOT EXISTS logo_url TEXT;
        
        COMMENT ON COLUMN public.ai_agents.logo_url IS 'URL to the agent logo stored in Supabase storage bucket "agent-logos"';
        
        CREATE INDEX IF NOT EXISTS idx_ai_agents_logo_url ON public.ai_agents(logo_url);
      `);
      return;
    }
    
    console.log('✅ logo_url column added successfully!');
    
    // Test the column by updating an existing agent
    const { data: testAgent, error: testError } = await supabase
      .from('ai_agents')
      .select('id, name, slug')
      .limit(1)
      .single();
    
    if (testError) {
      console.error('❌ Error fetching test agent:', testError);
      return;
    }
    
    console.log('📋 Test agent found:', testAgent.name);
    console.log('🔗 Example logo URL format:');
    console.log(`https://uilnynmclpohscpsequg.supabase.co/storage/v1/object/public/agent-logos/${testAgent.slug}-logo.png`);
    
  } catch (err) {
    console.error('💥 Exception:', err);
  }
}

addLogoUrlColumn(); 