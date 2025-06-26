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

async function directInsert() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // 1. First, check the current data
    console.log('\n=== Current Agents ===');
    const currentAgents = await client.query('SELECT id, name, slug FROM ai_agents LIMIT 5;');
    console.table(currentAgents.rows);
    
    // 2. Insert a new agent with minimal required fields
    console.log('\nInserting a new agent...');
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
    
    const timestamp = new Date().getTime();
    const agentData = {
      name: `Test Agent ${timestamp}`,
      slug: `test-agent-${timestamp}`,
      website_url: 'https://example.com',
      category: 'Development',
      pricing_type: 'free',
      status: 'approved'
    };
    
    const insertResult = await client.query(insertQuery, [
      agentData.name,
      agentData.slug,
      agentData.website_url,
      agentData.category,
      agentData.pricing_type,
      agentData.status
    ]);
    
    console.log('\n✅ Successfully inserted agent:');
    console.table(insertResult.rows[0]);
    
    // 3. Verify the insertion
    const agentId = insertResult.rows[0].id;
    const verifyQuery = 'SELECT * FROM ai_agents WHERE id = $1;';
    const verifyResult = await client.query(verifyQuery, [agentId]);
    
    console.log('\n=== Agent Details ===');
    const agent = verifyResult.rows[0];
    
    // Print all columns and values
    for (const [key, value] of Object.entries(agent)) {
      console.log(`${key}: ${value !== null ? value : 'NULL'}`);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    // If there's a constraint violation, show the constraint details
    if (error.code === '23505') { // unique_violation
      console.log('\nThis error is due to a unique constraint violation.');
      console.log('Detail:', error.detail);
    }
    
    // If there's a foreign key violation
    if (error.code === '23503') { // foreign_key_violation
      console.log('\nThis error is due to a foreign key constraint violation.');
      console.log('Detail:', error.detail);
    }
    
    // If there's an invalid input value for an enum
    if (error.code === '22P02') { // invalid_text_representation
      console.log('\nThis error is due to an invalid input value for an enum type.');
      console.log('Hint:', error.hint);
    }
    
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

directInsert();
