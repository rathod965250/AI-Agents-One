const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEnumValues() {
  console.log('Testing enum_values function...\n');

  try {
    // Test with agent_submissions table
    console.log('1. Testing agent_submissions.category:');
    const { data: catData, error: catError } = await supabase.rpc('enum_values', { 
      table_name: 'agent_submissions', 
      column_name: 'category' 
    });
    console.log('Result:', catData);
    console.log('Error:', catError);
    console.log('');

    console.log('2. Testing agent_submissions.pricing_type:');
    const { data: priceData, error: priceError } = await supabase.rpc('enum_values', { 
      table_name: 'agent_submissions', 
      column_name: 'pricing_type' 
    });
    console.log('Result:', priceData);
    console.log('Error:', priceError);
    console.log('');

    // Let's also check what tables exist
    console.log('3. Checking available tables:');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    console.log('Tables:', tables?.map(t => t.table_name));
    console.log('Error:', tablesError);
    console.log('');

    // Check the structure of agent_submissions table
    console.log('4. Checking agent_submissions table structure:');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, udt_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'agent_submissions');
    console.log('Columns:', columns);
    console.log('Error:', columnsError);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEnumValues(); 