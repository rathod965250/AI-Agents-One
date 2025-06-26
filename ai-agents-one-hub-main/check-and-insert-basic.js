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

async function checkAndInsertBasic() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // 1. List all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log('\n=== Tables in Database ===');
    const tablesResult = await client.query(tablesQuery);
    console.table(tablesResult.rows);
    
    // 2. Check ai_agents table structure
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'ai_agents';
    `;
    
    console.log('\n=== AI Agents Table Structure ===');
    const columnsResult = await client.query(columnsQuery);
    console.table(columnsResult.rows);
    
    // 3. Insert a basic agent
    console.log('\nInserting a basic agent...');
    const insertQuery = `
      INSERT INTO ai_agents (
        name,
        slug,
        website_url,
        category,
        pricing_type,
        status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, name, slug, category, created_at;
    `;
    
    const insertValues = [
      'Basic Test Agent',
      'basic-test-agent',
      'https://example.com',
      'Test',
      'free',
      'approved'
    ];
    
    const insertResult = await client.query(insertQuery, insertValues);
    console.log('\n✅ Successfully inserted basic agent:');
    console.table(insertResult.rows[0]);
    
    // 4. Verify the insertion
    const agentId = insertResult.rows[0].id;
    const verifyQuery = `
      SELECT * FROM ai_agents WHERE id = $1;
    `;
    
    const verifyResult = await client.query(verifyQuery, [agentId]);
    console.log('\n=== Verification ===');
    console.log('Agent data from database:');
    console.log(JSON.stringify(verifyResult.rows[0], null, 2));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

checkAndInsertBasic();
