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

async function updateAgentWithSQL() {
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
    
    // Update the agent with JSON data
    const updateQuery = `
      UPDATE ai_agents 
      SET 
        name = 'CodeAssist Pro',
        tagline = 'AI-powered coding assistant for developers',
        description = 'CodeAssist Pro is an advanced AI coding assistant that helps developers write better code faster. With intelligent code completion, bug detection, and automated refactoring, it integrates seamlessly with your favorite IDEs.',
        category = 'Development',
        website_url = 'https://codeassist.pro',
        pricing_type = 'freemium',
        features = '{"code completion", "function generation", "comment-to-code conversion", "multiple language support", "IDE integration"}',
        technical_specs = '{"Built with modern development frameworks", "API available for integration", "Supports VS Code, JetBrains IDEs, Neovim and more", "Real-time collaboration features", "Enterprise-grade security"}',
        gallery = '{"https://images.unsplash.com/photo-1617791160536-598cf32026fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"}',
        pricing = '{"type": "subscription", "plans": [{"name": "Free", "price": 0, "features": ["Basic code completion", "5 requests per hour", "Community support"]}, {"name": "Pro", "price": 10, "period": "month", "features": ["Advanced code completion", "Unlimited requests", "Priority support", "Team collaboration"]}, {"name": "Enterprise", "price": 19, "period": "month", "features": ["All Pro features", "Custom models", "Dedicated support", "SLA", "Custom integrations"]}]}',
        average_rating = 4.7,
        total_reviews = 128,
        developer = 'AI Innovations Inc.',
        launch_date = '2023-01-15T00:00:00Z',
        homepage_image_url = 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        contact_email = 'support@codeassist.pro',
        repository_url = 'https://github.com/codeassist/codeassist-pro',
        documentation_url = 'https://docs.codeassist.pro',
        linkedin_url = 'https://linkedin.com/company/codeassist-pro',
        twitter_url = 'https://twitter.com/codeassistpro',
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, tagline, category, average_rating;
    `;
    
    const result = await client.query(updateQuery, [agentId]);
    
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

updateAgentWithSQL();
