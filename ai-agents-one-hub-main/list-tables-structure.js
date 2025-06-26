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

async function listTablesAndStructure() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // List all tables
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('Fetching list of tables...');
    const tablesResult = await client.query(tablesQuery);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the database.');
      return;
    }
    
    console.log('\n=== Tables in Database ===');
    
    // For each table, get its structure
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      console.log(`\nTable: ${tableName}`);
      
      // Get column information for the table
      const columnsQuery = `
        SELECT 
          column_name, 
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `;
      
      const columnsResult = await client.query(columnsQuery, [tableName]);
      
      if (columnsResult.rows.length > 0) {
        console.table(columnsResult.rows);
      } else {
        console.log('  No columns found for this table.');
      }
      
      // If this is the ai_agents table, also check for enums
      if (tableName === 'ai_agents') {
        const enumQuery = `
          SELECT t.typname as enum_name, e.enumlabel as enum_value
          FROM pg_type t 
          JOIN pg_enum e ON t.oid = e.enumtypid  
          JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
          WHERE n.nspname = 'public';
        `;
        
        try {
          const enumResult = await client.query(enumQuery);
          if (enumResult.rows.length > 0) {
            console.log('\nEnum Types:');
            console.table(enumResult.rows);
          }
        } catch (e) {
          console.log('  Could not retrieve enum types:', e.message);
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

listTablesAndStructure();
