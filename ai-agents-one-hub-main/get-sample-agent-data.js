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

async function getSampleAgentData() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // Get a sample agent with all its data
    const query = `
      SELECT * FROM ai_agents 
      LIMIT 1;
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length === 0) {
      console.log('No agents found in the database.');
      return;
    }
    
    const agent = result.rows[0];
    
    console.log('\n=== Sample Agent Data ===');
    console.log(JSON.stringify(agent, null, 2));
    
    // Log the type of each field
    console.log('\n=== Field Types ===');
    Object.entries(agent).forEach(([key, value]) => {
      console.log(`${key}: ${typeof value}${Array.isArray(value) ? ' (Array)' : ''}`);
    });
    
  } catch (error) {
    console.error('Error fetching sample agent:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

getSampleAgentData();
