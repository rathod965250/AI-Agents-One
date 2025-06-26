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

async function getTableStructure() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // Get column information for ai_agents table
    const query = `
      SELECT 
        column_name, 
        data_type,
        is_nullable,
        column_default
      FROM 
        information_schema.columns
      WHERE 
        table_name = 'ai_agents'
        AND table_schema = 'public'
      ORDER BY 
        ordinal_position;
    `;
    
    const result = await client.query(query);
    
    console.log('\n=== AI Agents Table Structure ===');
    console.table(result.rows);
    
    // Get sample data to understand content
    const sampleQuery = `
      SELECT * FROM ai_agents 
      LIMIT 1;
    `;
    
    const sampleResult = await client.query(sampleQuery);
    
    console.log('\n=== Sample Agent Data ===');
    if (sampleResult.rows.length > 0) {
      console.log(JSON.stringify(sampleResult.rows[0], null, 2));
    } else {
      console.log('No agents found in the database.');
    }
    
  } catch (error) {
    console.error('Error getting table structure:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

getTableStructure();
