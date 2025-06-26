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

async function checkAndInsertAgent() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // First, check the structure of the ai_agents table
    const checkTableQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'ai_agents'
      ORDER BY ordinal_position;
    `;
    
    console.log('Checking table structure...');
    const tableStructure = await client.query(checkTableQuery);
    
    console.log('\n=== AI Agents Table Structure ===');
    console.table(tableStructure.rows);
    
    // Try to insert a minimal agent
    console.log('\nAttempting to insert a minimal agent...');
    const insertQuery = `
      INSERT INTO ai_agents (
        name, 
        slug, 
        website_url, 
        category, 
        pricing_type,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, slug, category, created_at;
    `;
    
    const insertValues = [
      'Minimal Test Agent',
      'minimal-test-agent',
      'https://example.com',
      'Test',
      'free',
      'approved'
    ];
    
    const insertResult = await client.query(insertQuery, insertValues);
    console.log('\n✅ Successfully inserted agent:');
    console.table(insertResult.rows[0]);
    
    // Now try to update it with more fields
    const newAgentId = insertResult.rows[0].id;
    console.log(`\nAttempting to update agent ${newAgentId} with more fields...`);
    
    const updateQuery = `
      UPDATE ai_agents 
      SET 
        tagline = $1,
        description = $2,
        average_rating = $3,
        total_reviews = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *;
    `;
    
    const updateValues = [
      'A minimal test agent',
      'This is a test agent created to verify the database structure.',
      4.5,
      10,
      newAgentId
    ];
    
    const updateResult = await client.query(updateQuery, updateValues);
    console.log('\n✅ Successfully updated agent:');
    console.table(updateResult.rows[0]);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

checkAndInsertAgent();
