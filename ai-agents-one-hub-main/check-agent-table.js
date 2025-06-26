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

async function checkAgentTable() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // 1. Check ai_agents table structure
    console.log('\n=== AI Agents Table Structure ===');
    const tableQuery = `
      SELECT 
        column_name, 
        data_type,
        udt_name,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'ai_agents'
      ORDER BY ordinal_position;
    `;
    
    const tableResult = await client.query(tableQuery);
    console.table(tableResult.rows);
    
    // 2. Check for enum types
    console.log('\n=== Enum Types ===');
    const enumQuery = `
      SELECT t.typname as enum_name, 
             e.enumlabel as enum_value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public';
    `;
    
    try {
      const enumResult = await client.query(enumQuery);
      if (enumResult.rows.length > 0) {
        console.table(enumResult.rows);
      } else {
        console.log('No enum types found.');
      }
    } catch (e) {
      console.log('Error fetching enum types:', e.message);
    }
    
    // 3. Check constraints
    console.log('\n=== Table Constraints ===');
    const constraintQuery = `
      SELECT 
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        LEFT JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.table_name = 'ai_agents';
    `;
    
    const constraintResult = await client.query(constraintQuery);
    if (constraintResult.rows.length > 0) {
      console.table(constraintResult.rows);
    } else {
      console.log('No constraints found for ai_agents table.');
    }
    
    // 4. Try to get a sample agent
    console.log('\n=== Sample Agent Data ===');
    const sampleQuery = `
      SELECT * FROM ai_agents 
      LIMIT 1;
    `;
    
    const sampleResult = await client.query(sampleQuery);
    if (sampleResult.rows.length > 0) {
      console.log('Sample agent found:');
      console.log(JSON.stringify(sampleResult.rows[0], null, 2));
    } else {
      console.log('No agents found in the database.');
    }
    
  } catch (error) {
    console.error('Error checking agent table:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

checkAgentTable();
