// Test script to verify PostgreSQL connection using pg package
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

async function testConnection() {
  const client = new Client(config);
  
  try {
    console.log('Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Successfully connected to the database!');
    
    // Test query to get current database
    const dbResult = await client.query('SELECT current_database()');
    console.log('Current database:', dbResult.rows[0].current_database);
    
    // Get current user
    const userResult = await client.query('SELECT current_user');
    console.log('Current user:', userResult.rows[0].current_user);
    
    // List tables in public schema
    console.log('\nListing tables in public schema...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('\nTables in public schema:');
      console.table(tablesResult.rows);
      
      // Get row count from first table
      const firstTable = tablesResult.rows[0].table_name;
      console.log(`\nGetting row count from table '${firstTable}'...`);
      
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM "${firstTable}"`);
        console.log(`Row count in ${firstTable}:`, countResult.rows[0].count);
        
        // Get first row if table is not empty
        if (parseInt(countResult.rows[0].count) > 0) {
          const rowResult = await client.query(`SELECT * FROM "${firstTable}" LIMIT 1`);
          console.log('\nFirst row:');
          console.log(JSON.stringify(rowResult.rows[0], null, 2));
        }
      } catch (tableError) {
        console.error(`Error querying table '${firstTable}':`, tableError.message);
      }
    } else {
      console.log('No tables found in public schema');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

testConnection();
