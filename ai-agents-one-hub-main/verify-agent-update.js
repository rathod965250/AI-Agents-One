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

async function verifyAgentUpdate() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // Get the most recently updated agent
    const query = `
      SELECT 
        id,
        name,
        tagline,
        category,
        pricing_type,
        average_rating,
        total_reviews,
        features,
        technical_specs,
        gallery,
        pricing
      FROM ai_agents
      ORDER BY updated_at DESC
      LIMIT 1;
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length === 0) {
      console.log('No agents found in the database.');
      return;
    }
    
    const agent = result.rows[0];
    
    console.log('\n=== Agent Details ===');
    console.log(`Name: ${agent.name}`);
    console.log(`Tagline: ${agent.tagline}`);
    console.log(`Category: ${agent.category}`);
    console.log(`Pricing Type: ${agent.pricing_type}`);
    console.log(`Rating: ${agent.average_rating} (${agent.total_reviews} reviews)`);
    
    console.log('\n=== Features ===');
    if (agent.features && agent.features.length > 0) {
      agent.features.forEach((feature, i) => console.log(`${i + 1}. ${feature}`));
    } else {
      console.log('No features found.');
    }
    
    console.log('\n=== Technical Specs ===');
    if (agent.technical_specs && agent.technical_specs.length > 0) {
      agent.technical_specs.forEach((spec, i) => console.log(`${i + 1}. ${spec}`));
    } else {
      console.log('No technical specs found.');
    }
    
    console.log('\n=== Gallery ===');
    if (agent.gallery && agent.gallery.length > 0) {
      console.log(`Found ${agent.gallery.length} gallery items`);
    } else {
      console.log('No gallery items found.');
    }
    
    console.log('\n=== Pricing ===');
    if (agent.pricing) {
      console.log(`Pricing Type: ${agent.pricing.type}`);
      if (agent.pricing.plans && agent.pricing.plans.length > 0) {
        console.log('Plans:');
        agent.pricing.plans.forEach(plan => {
          console.log(`- ${plan.name}: $${plan.price}${plan.period ? `/${plan.period}` : ''}`);
          console.log(`  Features: ${plan.features.join(', ')}`);
        });
      }
    } else {
      console.log('No pricing information available.');
    }
    
  } catch (error) {
    console.error('Error verifying agent update:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

verifyAgentUpdate();
