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

async function listColumns() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // Query to get all tables in the public schema
    const query = `
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public'
      ORDER BY 
        table_name, 
        ordinal_position;
    `;
    
    const result = await client.query(query);
    
    // Group columns by table
    const tables = {};
    result.rows.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES'
      });
    });
    
    // Print tables and their columns
    console.log('=== Database Schema ===\n');
    for (const [table, columns] of Object.entries(tables)) {
      console.log(`Table: ${table}`);
      console.table(columns);
      console.log('\n');
    }
    
  } catch (error) {
    console.error('Error listing columns:', error);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

listColumns();
