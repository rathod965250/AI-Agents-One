const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://uilnynmclpohscpsequg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0'
);

async function applySlugGeneration() {
  console.log('🔧 Setting up automatic slug generation...');
  
  try {
    // First, let's check current agents and their slugs
    console.log('\n📊 Current agents and their slugs:');
    const { data: currentAgents, error: fetchError } = await supabase
      .from('ai_agents')
      .select('id, name, slug')
      .order('name');
    
    if (fetchError) {
      console.error('❌ Error fetching agents:', fetchError);
      return;
    }
    
    currentAgents.forEach(agent => {
      console.log(`   ${agent.name} → ${agent.slug}`);
    });
    
    console.log('\n📝 Please run this SQL in your Supabase SQL Editor to set up automatic slug generation:');
    console.log(`
-- Create a function to generate slugs from agent names
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(input_text, '[^a-zA-Z0-9\s-]', '', 'g'), -- Remove special characters except spaces and hyphens
        '\s+', '-', 'g' -- Replace spaces with hyphens
      ),
      '-+', '-', 'g' -- Replace multiple hyphens with single hyphen
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create a function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_slug(agent_name TEXT, existing_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
  slug_exists BOOLEAN;
BEGIN
  -- Generate base slug from name
  base_slug := generate_slug(agent_name);
  
  -- If base slug is empty, use a default
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'agent';
  END IF;
  
  -- Check if slug already exists
  final_slug := base_slug;
  
  LOOP
    -- Check if slug exists (excluding current record if updating)
    IF existing_id IS NULL THEN
      SELECT EXISTS(SELECT 1 FROM ai_agents WHERE slug = final_slug) INTO slug_exists;
    ELSE
      SELECT EXISTS(SELECT 1 FROM ai_agents WHERE slug = final_slug AND id != existing_id) INTO slug_exists;
    END IF;
    
    -- If slug doesn't exist, use it
    IF NOT slug_exists THEN
      RETURN final_slug;
    END IF;
    
    -- If slug exists, add counter and try again
    counter := counter + 1;
    final_slug := base_slug || '-' || counter::TEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function to automatically set slug on insert/update
CREATE OR REPLACE FUNCTION set_agent_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set slug if it's not provided or if name changed
  IF NEW.slug IS NULL OR NEW.slug = '' OR 
     (TG_OP = 'UPDATE' AND OLD.name != NEW.name) THEN
    NEW.slug := generate_unique_slug(NEW.name, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic slug generation
DROP TRIGGER IF EXISTS trigger_set_agent_slug ON ai_agents;
CREATE TRIGGER trigger_set_agent_slug
  BEFORE INSERT OR UPDATE ON ai_agents
  FOR EACH ROW
  EXECUTE FUNCTION set_agent_slug();
    `);
    
    console.log('\n🎯 After running the SQL, you can test it with:');
    console.log(`
-- Test the slug generation function
SELECT generate_slug('VoiceClone Pro') as test_slug;
-- Should return: voiceclone-pro

-- Test unique slug generation
SELECT generate_unique_slug('My New AI Agent') as unique_slug;
-- Should return: my-new-ai-agent

-- Test inserting a new agent (slug will be auto-generated)
INSERT INTO ai_agents (name, website_url, category, pricing_type, status) 
VALUES ('Test AI Agent', 'https://example.com', 'productivity', 'free', 'pending');
    `);
    
    console.log('\n✅ Once the SQL is applied, all new agents will automatically get slugs!');
    
  } catch (err) {
    console.error('💥 Exception:', err);
  }
}

applySlugGeneration(); 