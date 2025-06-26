import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uilnynmclpohscpsequg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function updateAgentSchema() {
  try {
    console.log('Updating AI Agents table schema...');
    
    // SQL to add missing columns with appropriate data types
    const alterTableSQL = `
      -- Add columns if they don't exist
      DO $$
      BEGIN
        -- Basic Info
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'tagline') THEN
          ALTER TABLE ai_agents ADD COLUMN tagline TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'description') THEN
          ALTER TABLE ai_agents ADD COLUMN description TEXT;
        END IF;

        
        -- Features & Details
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'features') THEN
          ALTER TABLE ai_agents ADD COLUMN features TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'technical_specs') THEN
          ALTER TABLE ai_agents ADD COLUMN technical_specs TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'gallery') THEN
          ALTER TABLE ai_agents ADD COLUMN gallery TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'integrations') THEN
          ALTER TABLE ai_agents ADD COLUMN integrations TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'case_studies') THEN
          ALTER TABLE ai_agents ADD COLUMN case_studies TEXT[] DEFAULT '{}';
        END IF;
        
        -- Pricing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'pricing') THEN
          ALTER TABLE ai_agents ADD COLUMN pricing JSONB DEFAULT '{}'::jsonb;
        END IF;
        
        -- Reviews & Ratings
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'average_rating') THEN
          ALTER TABLE ai_agents ADD COLUMN average_rating NUMERIC(3, 2) DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'total_reviews') THEN
          ALTER TABLE ai_agents ADD COLUMN total_reviews INTEGER DEFAULT 0;
        END IF;
        
        -- Additional metadata
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'developer') THEN
          ALTER TABLE ai_agents ADD COLUMN developer TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'launch_date') THEN
          ALTER TABLE ai_agents ADD COLUMN launch_date TIMESTAMP WITH TIME ZONE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'homepage_image_url') THEN
          ALTER TABLE ai_agents ADD COLUMN homepage_image_url TEXT;
        END IF;
      END $$;
    `;
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: alterTableSQL });
    
    if (error) {
      console.error('Error updating schema:', error);
      return;
    }
    
    console.log('✅ Schema updated successfully!');
    
    // Create indexes for better performance
    const createIndexesSQL = `
      -- Create indexes for better query performance
      DO $$
      BEGIN
        -- Index for category filter
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'ai_agents' AND indexname = 'idx_ai_agents_category'
        ) THEN
          CREATE INDEX idx_ai_agents_category ON ai_agents(category);
        END IF;
        
        -- Index for search
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'ai_agents' AND indexname = 'idx_ai_agents_search'
        ) THEN
          CREATE INDEX idx_ai_agents_search ON ai_agents 
          USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(tagline, '')));
        END IF;
        
        -- Index for sorting by rating
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'ai_agents' AND indexname = 'idx_ai_agents_rating'
        ) THEN
          CREATE INDEX idx_ai_agents_rating ON ai_agents(average_rating DESC NULLS LAST);
        END IF;
      END $$;
    `;
    
    const { data: indexData, error: indexError } = await supabase.rpc('exec_sql', { sql: createIndexesSQL });
    
    if (indexError) {
      console.error('Error creating indexes:', indexError);
    } else {
      console.log('✅ Indexes created successfully!');
    }
    
  } catch (error) {
    console.error('Error updating schema:', error);
  }
}

updateAgentSchema();
