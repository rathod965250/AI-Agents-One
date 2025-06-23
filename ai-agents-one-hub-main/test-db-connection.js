const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.uilnynmclpohscpsequg:Sri%409036%21@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false // For testing only
  }
});

async function testConnection() {
  const client = await pool.connect();
  try {
    console.log('Successfully connected to the database!');
    const res = await client.query('SELECT current_database(), current_user, current_schema;');
    console.log('Database Info:', res.rows[0]);
    
    // List all tables
    const tables = await client.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name;`
    );
    console.log('\nTables in the database:');
    console.table(tables.rows);
    
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
