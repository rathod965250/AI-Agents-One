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

async function updateAgentData() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // First, get an agent ID to update
    const getAgentQuery = `
      SELECT id FROM ai_agents 
      LIMIT 1;
    `;
    
    const agentResult = await client.query(getAgentQuery);
    
    if (agentResult.rows.length === 0) {
      console.log('No agents found. Please create an agent first.');
      return;
    }
    
    const agentId = agentResult.rows[0].id;
    
    // Update the agent with properly formatted data
    const updateQuery = `
      UPDATE ai_agents 
      SET 
        name = $1,
        tagline = $2,
        description = $3,
        category = $4,
        website_url = $5,
        pricing_type = $6,
        features = $7,
        technical_specs = $8,
        gallery = $9,
        pricing = $10,
        average_rating = $11,
        total_reviews = $12,
        developer = $13,
        launch_date = $14,
        homepage_image_url = $15,
        contact_email = $16,
        repository_url = $17,
        documentation_url = $18,
        linkedin_url = $19,
        twitter_url = $20,
        updated_at = NOW()
      WHERE id = $21
      RETURNING id, name, tagline, category, average_rating;
    `;
    
    // Prepare the data with proper types
    const updateValues = [
      'CodeAssist Pro', // name
      'AI-powered coding assistant for developers', // tagline
      'CodeAssist Pro is an advanced AI coding assistant that helps developers write better code faster. With intelligent code completion, bug detection, and automated refactoring, it integrates seamlessly with your favorite IDEs.', // description
      'Development', // category
      'https://codeassist.pro', // website_url
      'freemium', // pricing_type
      ['code completion', 'function generation', 'comment-to-code conversion', 'multiple language support', 'IDE integration'], // features
      [
        'Built with modern development frameworks',
        'API available for integration',
        'Supports VS Code, JetBrains IDEs, Neovim and more',
        'Real-time collaboration features',
        'Enterprise-grade security'
      ], // technical_specs
      [
        'https://images.unsplash.com/photo-1617791160536-598cf32026fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      ], // gallery
      {
        type: 'subscription',
        plans: [
          {
            name: 'Free',
            price: 0,
            features: ['Basic code completion', '5 requests per hour', 'Community support']
          },
          {
            name: 'Pro',
            price: 10,
            period: 'month',
            features: ['Advanced code completion', 'Unlimited requests', 'Priority support', 'Team collaboration']
          },
          {
            name: 'Enterprise',
            price: 19,
            period: 'month',
            features: ['All Pro features', 'Custom models', 'Dedicated support', 'SLA', 'Custom integrations']
          }
        ]
      }, // pricing
      4.7, // average_rating
      128, // total_reviews
      'AI Innovations Inc.', // developer
      new Date('2023-01-15T00:00:00Z'), // launch_date
      'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', // homepage_image_url
      'support@codeassist.pro', // contact_email
      'https://github.com/codeassist/codeassist-pro', // repository_url
      'https://docs.codeassist.pro', // documentation_url
      'https://linkedin.com/company/codeassist-pro', // linkedin_url
      'https://twitter.com/codeassistpro', // twitter_url
      agentId // id
    ];
    
    const result = await client.query(updateQuery, updateValues);
    
    if (result.rowCount === 0) {
      console.log('No agent was updated. The agent might not exist.');
    } else {
      console.log('✅ Successfully updated agent:');
      console.table(result.rows[0]);
    }
    
  } catch (error) {
    console.error('Error updating agent:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

updateAgentData();
