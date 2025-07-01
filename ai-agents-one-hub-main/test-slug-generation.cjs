const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://uilnynmclpohscpsequg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0'
);

// Test cases for slug generation
const testCases = [
  'VoiceClone Pro',
  'My New AI Agent',
  'ChatGPT Assistant',
  'Code Helper 2.0',
  'AI-Powered Tool',
  'Super Duper AI Agent',
  'Test Agent with Special Characters!@#',
  'Multiple   Spaces   Agent',
  'Agent-With-Hyphens',
  '123 Number Agent'
];

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

async function testSlugGeneration() {
  console.log('🧪 Testing automatic slug generation...\n');
  
  console.log('📋 Test cases and their expected slugs:');
  testCases.forEach(name => {
    const slug = generateSlug(name);
    console.log(`   "${name}" → "${slug}"`);
  });
  
  console.log('\n📝 To enable automatic slug generation, run this SQL in your Supabase SQL Editor:');
  console.log(`
-- Step 1: Create the slug generation function
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(input_text, '[^a-zA-Z0-9\\s-]', '', 'g'),
        '\\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 2: Create unique slug generation function
CREATE OR REPLACE FUNCTION generate_unique_slug(agent_name TEXT, existing_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
  slug_exists BOOLEAN;
BEGIN
  base_slug := generate_slug(agent_name);
  
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'agent';
  END IF;
  
  final_slug := base_slug;
  
  LOOP
    IF existing_id IS NULL THEN
      SELECT EXISTS(SELECT 1 FROM ai_agents WHERE slug = final_slug) INTO slug_exists;
    ELSE
      SELECT EXISTS(SELECT 1 FROM ai_agents WHERE slug = final_slug AND id != existing_id) INTO slug_exists;
    END IF;
    
    IF NOT slug_exists THEN
      RETURN final_slug;
    END IF;
    
    counter := counter + 1;
    final_slug := base_slug || '-' || counter::TEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create trigger function
CREATE OR REPLACE FUNCTION set_agent_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' OR 
     (TG_OP = 'UPDATE' AND OLD.name != NEW.name) THEN
    NEW.slug := generate_unique_slug(NEW.name, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create the trigger
DROP TRIGGER IF EXISTS trigger_set_agent_slug ON ai_agents;
CREATE TRIGGER trigger_set_agent_slug
  BEFORE INSERT OR UPDATE ON ai_agents
  FOR EACH ROW
  EXECUTE FUNCTION set_agent_slug();
  `);
  
  console.log('\n🎯 After applying the SQL, test with:');
  console.log(`
-- Test the function directly
SELECT generate_slug('VoiceClone Pro') as test_slug;

-- Insert a new agent (slug will be auto-generated)
INSERT INTO ai_agents (name, website_url, category, pricing_type, status) 
VALUES ('Test AI Agent', 'https://example.com', 'productivity', 'free', 'pending');

-- Check the result
SELECT name, slug FROM ai_agents WHERE name = 'Test AI Agent';
  `);
  
  console.log('\n✅ Benefits of this system:');
  console.log('   • Automatic slug generation from agent names');
  console.log('   • Handles duplicates by adding numbers (e.g., my-agent, my-agent-1)');
  console.log('   • Works for both INSERT and UPDATE operations');
  console.log('   • Preserves existing slugs if manually set');
  console.log('   • URL-friendly slugs for better SEO');
  
  console.log('\n🚀 Once implemented, you can simply insert agents like this:');
  console.log(`
INSERT INTO ai_agents (name, website_url, category, pricing_type, status) 
VALUES ('My New AI Tool', 'https://example.com', 'productivity', 'free', 'pending');
-- Slug will automatically be: my-new-ai-tool
  `);
}

testSlugGeneration(); 