// Script to list all tables in the Supabase database
import pg from 'pg';
const { Client } = pg;

// Connection configuration
const config = {
  user: 'postgres.uilnynmclpohscpsequg',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  database: 'postgres',
  password: 'Sri@9036!',
  port: 6543,
  ssl: {
    rejectUnauthorized: false // For testing only
  }
};

async function listTables() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // Query to get all tables in the public schema
    const query = `
      SELECT 
        table_name,
        (xpath('/row/cnt/text()', 
          query_to_xml(format('SELECT COUNT(*) as cnt FROM %I.%I', 
          table_schema, table_name), false, true, '')))[1]::text::int as row_count
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length === 0) {
      console.log('No tables found in the public schema');
      return;
    }
    
    console.log('\nTables in the database:');
    console.log('='.repeat(60));
    console.log(`${'Table Name'.padEnd(30)} | Row Count`);
    console.log('-'.repeat(60));
    
    let totalTables = 0;
    let totalRows = 0;
    
    result.rows.forEach(row => {
      console.log(`${row.table_name.padEnd(30)} | ${row.row_count.toLocaleString()}`);
      totalTables++;
      totalRows += row.row_count;
    });
    
    console.log('='.repeat(60));
    console.log(`Total tables: ${totalTables}`);
    console.log(`Total rows across all tables: ${totalRows.toLocaleString()}`);
    
  } catch (error) {
    console.error('Error listing tables:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

listTables();
