import pg from 'pg';
const { Client } = pg;

const config = {
  user: 'postgres.uilnynmclpohscpsequg',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  database: 'postgres',
  password: 'Sri@9036!',
  port: 6543,
  ssl: { rejectUnauthorized: false }
};

async function fixAgentData() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // Check if we have an agent to update
    const checkQuery = `
      SELECT id, name FROM ai_agents 
      WHERE name IS NOT NULL
      LIMIT 1;
    `;
    
    const checkResult = await client.query(checkQuery);
    
    if (checkResult.rows.length === 0) {
      console.log('No agent found with a name. Creating a new one...');
      
      // Insert a new agent with minimal required fields
      const insertQuery = `
        INSERT INTO ai_agents (
          name, 
          slug, 
          website_url, 
          category, 
          pricing_type,
          status
        ) VALUES (
          'CodeAssist Pro',
          'codeassist-pro',
          'https://codeassist.pro',
          'Development',
          'freemium',
          'approved'
        )
        RETURNING id;
      `;
      
      const insertResult = await client.query(insertQuery);
      console.log('Created new agent with ID:', insertResult.rows[0].id);
      
      // Use the new agent ID
      const agentId = insertResult.rows[0].id;
      
      // Update the new agent with additional data
      await updateAgentData(client, agentId);
    } else {
      const agentId = checkResult.rows[0].id;
      console.log(`Updating existing agent with ID: ${agentId}`);
      await updateAgentData(client, agentId);
    }
    
  } catch (error) {
    console.error('Error in fixAgentData:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

async function updateAgentData(client, agentId) {
  try {
    // First, check if we need to add any columns
    const addColumnsQuery = `
      DO $$
      BEGIN
        -- Add columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'tagline') THEN
          ALTER TABLE ai_agents ADD COLUMN tagline TEXT;
          RAISE NOTICE 'Added tagline column';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'description') THEN
          ALTER TABLE ai_agents ADD COLUMN description TEXT;
          RAISE NOTICE 'Added description column';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'average_rating') THEN
          ALTER TABLE ai_agents ADD COLUMN average_rating NUMERIC(3,1) DEFAULT 0;
          RAISE NOTICE 'Added average_rating column';
        END IF;


        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'ai_agents' AND column_name = 'total_reviews') THEN
          ALTER TABLE ai_agents ADD COLUMN total_reviews INTEGER DEFAULT 0;
          RAISE NOTICE 'Added total_reviews column';
        END IF;
      END $$;
    `;

    console.log('Ensuring required columns exist...');
    await client.query(addColumnsQuery);
    
    // Now update the agent with the data
    const updateQuery = `
      UPDATE ai_agents 
      SET 
        name = $1,
        tagline = $2,
        description = $3,
        category = $4,
        website_url = $5,
        pricing_type = $6,
        average_rating = $7,
        total_reviews = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING id, name, tagline, category, average_rating, total_reviews;
    `;
    
    const updateValues = [
      'CodeAssist Pro',
      'AI-powered coding assistant for developers',
      'CodeAssist Pro is an advanced AI coding assistant that helps developers write better code faster. With intelligent code completion, bug detection, and automated refactoring, it integrates seamlessly with your favorite IDEs.',
      'Development',
      'https://codeassist.pro',
      'freemium',
      4.7, // average_rating
      128,  // total_reviews
      agentId
    ];
    
    console.log('Updating agent data...');
    const result = await client.query(updateQuery, updateValues);
    
    if (result.rowCount === 0) {
      console.log('No agent was updated.');
    } else {
      console.log('✅ Successfully updated agent:');
      console.table(result.rows[0]);
    }
    
  } catch (error) {
    console.error('Error updating agent data:', error);
  }
}

// Run the function
fixAgentData();
