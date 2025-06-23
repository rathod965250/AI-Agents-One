// Test script to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

// Initialize the client with your Supabase URL and anon key
const supabaseUrl = 'https://uilnynmclpohscpsequg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0';

console.log('Initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    console.log('1. Testing basic Supabase connection...');
    
    // Test basic connection by fetching server timestamp
    const { data: timeData, error: timeError } = await supabase.rpc('now');
    
    if (timeError) {
      console.error('Error connecting to Supabase:', timeError);
      return;
    }
    
    console.log('✅ Connected to Supabase! Server time:', timeData);
    
    // Try to list tables using information_schema
    console.log('\n2. Fetching tables from information_schema...');
    try {
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name, table_schema')
        .eq('table_schema', 'public')
        .limit(5);
      
      if (tablesError) throw tablesError;
      
      if (tables && tables.length > 0) {
        console.log('✅ Found tables in public schema:');
        console.table(tables);
        
        // Try to get row count from the first table
        const firstTable = tables[0].table_name;
        console.log(`\n3. Testing query on table '${firstTable}'...`);
        
        try {
          const { data: row, error: rowError } = await supabase
            .from(firstTable)
            .select('*')
            .limit(1);
          
          if (rowError) throw rowError;
          
          if (row && row.length > 0) {
            console.log('✅ Retrieved first row:');
            console.log(JSON.stringify(row[0], null, 2));
          } else {
            console.log(`ℹ️ Table '${firstTable}' is empty`);
          }
        } catch (queryError) {
          console.error(`❌ Error querying table '${firstTable}':`, queryError.message);
        }
      } else {
        console.log('ℹ️ No tables found in the public schema');
      }
    } catch (schemaError) {
      console.error('❌ Error accessing information_schema:', schemaError.message);
      
      // Try an alternative approach with raw SQL if available
      console.log('\nTrying alternative approach with raw SQL...');
      try {
        const { data: sqlResult, error: sqlError } = await supabase.rpc('current_database');
        if (sqlError) throw sqlError;
        console.log('✅ Current database:', sqlResult);
      } catch (sqlError) {
        console.error('❌ Raw SQL query failed:', sqlError.message);
      }
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  } finally {
    console.log('\nTest completed');
  }
}

// Run the test
testConnection();
