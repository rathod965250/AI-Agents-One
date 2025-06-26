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

async function verifyAgentData() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // 1. Count total agents
    const countQuery = 'SELECT COUNT(*) as total_agents FROM ai_agents;';
    const countResult = await client.query(countQuery);
    console.log(`\nTotal agents in database: ${countResult.rows[0].total_agents}`);
    
    // 2. Get the most recent agent
    const recentAgentQuery = `
      SELECT 
        id, name, slug, category, 
        created_at, updated_at,
        (SELECT COUNT(*) FROM agent_reviews WHERE agent_id = ai_agents.id) as review_count,
        (SELECT COUNT(*) FROM faqs WHERE agent_id = ai_agents.id) as faq_count
      FROM ai_agents
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    
    console.log('\nFetching most recent agent...');
    const agentResult = await client.query(recentAgentQuery);
    
    if (agentResult.rows.length === 0) {
      console.log('No agents found in the database.');
      return;
    }
    
    const agent = agentResult.rows[0];
    console.log('\n=== Most Recent Agent ===');
    console.log(`ID: ${agent.id}`);
    console.log(`Name: ${agent.name}`);
    console.log(`Slug: ${agent.slug}`);
    console.log(`Category: ${agent.category}`);
    console.log(`Created: ${agent.created_at}`);
    console.log(`Updated: ${agent.updated_at}`);
    console.log(`Reviews: ${agent.review_count}`);
    console.log(`FAQs: ${agent.faq_count}`);
    
    // 3. Get agent details
    const agentDetailsQuery = 'SELECT * FROM ai_agents WHERE id = $1;';
    const detailsResult = await client.query(agentDetailsQuery, [agent.id]);
    
    console.log('\n=== Agent Details ===');
    const agentData = detailsResult.rows[0];
    
    // Print basic info
    console.log('\nBasic Information:');
    console.log(`- Tagline: ${agentData.tagline || 'N/A'}`);
    console.log(`- Description: ${agentData.description ? agentData.description.substring(0, 100) + '...' : 'N/A'}`);
    console.log(`- Website: ${agentData.website_url || 'N/A'}`);
    console.log(`- Pricing Type: ${agentData.pricing_type || 'N/A'}`);
    console.log(`- Status: ${agentData.status || 'N/A'}`);
    console.log(`- Average Rating: ${agentData.average_rating || 'N/A'}`);
    console.log(`- Total Reviews: ${agentData.total_reviews || 0}`);
    
    // Print features if available
    if (agentData.features && agentData.features.length > 0) {
      console.log('\nFeatures:');
      agentData.features.forEach((feature, i) => console.log(`  ${i + 1}. ${feature}`));
    }
    
    // Print technical specs if available
    if (agentData.technical_specs && agentData.technical_specs.length > 0) {
      console.log('\nTechnical Specs:');
      agentData.technical_specs.forEach((spec, i) => console.log(`  ${i + 1}. ${spec}`));
    }
    
    // Print pricing if available
    if (agentData.pricing) {
      console.log('\nPricing:');
      try {
        const pricing = typeof agentData.pricing === 'string' 
          ? JSON.parse(agentData.pricing) 
          : agentData.pricing;
        
        console.log(`- Type: ${pricing.type || 'N/A'}`);
        if (pricing.plans && pricing.plans.length > 0) {
          console.log('- Plans:');
          pricing.plans.forEach(plan => {
            console.log(`  - ${plan.name}: $${plan.price}${plan.period ? `/${plan.period}` : ''}`);
            if (plan.features && plan.features.length > 0) {
              console.log('    Features:', plan.features.join(', '));
            }
          });
        }
      } catch (e) {
        console.log('- Could not parse pricing data');
      }
    }
    
    // 4. Get agent reviews
    const reviewsQuery = 'SELECT * FROM agent_reviews WHERE agent_id = $1 ORDER BY created_at DESC;';
    const reviewsResult = await client.query(reviewsQuery, [agent.id]);
    
    if (reviewsResult.rows.length > 0) {
      console.log(`\n=== Reviews (${reviewsResult.rows.length}) ===`);
      reviewsResult.rows.forEach((review, i) => {
        console.log(`\nReview ${i + 1}:`);
        console.log(`- Rating: ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`);
        console.log(`- Comment: ${review.comment}`);
        console.log(`- Date: ${review.created_at}`);
      });
    } else {
      console.log('\nNo reviews found for this agent.');
    }
    
    // 5. Get agent FAQs
    const faqsQuery = 'SELECT * FROM faqs WHERE agent_id = $1 ORDER BY created_at;';
    const faqsResult = await client.query(faqsQuery, [agent.id]);
    
    if (faqsResult.rows.length > 0) {
      console.log(`\n=== FAQs (${faqsResult.rows.length}) ===`);
      faqsResult.rows.forEach((faq, i) => {
        console.log(`\nFAQ ${i + 1}:`);
        console.log(`Q: ${faq.question}`);
        console.log(`A: ${faq.answer}`);
      });
    } else {
      console.log('\nNo FAQs found for this agent.');
    }
    
  } catch (error) {
    console.error('Error verifying agent data:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

verifyAgentData();
