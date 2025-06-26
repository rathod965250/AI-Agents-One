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

async function checkColumns() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // Get column information for ai_agents table
    const query = `
      SELECT 
        column_name, 
        data_type,
        udt_name,
        is_nullable,
        column_default
      FROM 
        information_schema.columns
      WHERE 
        table_name = 'ai_agents'
      ORDER BY 
        ordinal_position;
    `;
    
    const result = await client.query(query);
    
    console.log('\n=== AI Agents Table Columns ===');
    console.table(result.rows);
    
    // Check for enum types
    const enumQuery = `
      SELECT t.typname as enum_name, 
             e.enumlabel as enum_value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public';
    `;
    
    const enumResult = await client.query(enumQuery);
    
    if (enumResult.rows.length > 0) {
      console.log('\n=== Enum Types ===');
      console.table(enumResult.rows);
    } else {
      console.log('\nNo enum types found in the database.');
    }
    
  } catch (error) {
    console.error('Error checking columns:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

checkColumns();
