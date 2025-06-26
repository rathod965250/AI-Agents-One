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

async function insertSampleAgent() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('Connected to Supabase database');
    
    // Start a transaction
    await client.query('BEGIN');
    
    // 1. Insert the agent
    const insertAgentQuery = `
      INSERT INTO ai_agents (
        name,
        slug,
        tagline,
        description,
        website_url,
        category,
        pricing_type,
        status,
        average_rating,
        total_reviews,
        developer,
        launch_date,
        homepage_image_url,
        contact_email,
        repository_url,
        documentation_url,
        linkedin_url,
        twitter_url,
        features,
        technical_specs,
        gallery,
        pricing
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      )
      RETURNING id, name, slug, category, created_at;
    `;
    
    const agentData = {
      name: 'CodeAssist Pro',
      slug: 'codeassist-pro',
      tagline: 'AI-powered coding assistant for developers',
      description: 'CodeAssist Pro is an advanced AI coding assistant that helps developers write better code faster. With intelligent code completion, bug detection, and automated refactoring, it integrates seamlessly with your favorite IDEs.',
      website_url: 'https://codeassist.pro',
      category: 'Development',
      pricing_type: 'freemium',
      status: 'approved',
      average_rating: 4.7,
      total_reviews: 128,
      developer: 'AI Innovations Inc.',
      launch_date: new Date('2023-01-15'),
      homepage_image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      contact_email: 'support@codeassist.pro',
      repository_url: 'https://github.com/codeassist/codeassist-pro',
      documentation_url: 'https://docs.codeassist.pro',
      linkedin_url: 'https://linkedin.com/company/codeassist-pro',
      twitter_url: 'https://twitter.com/codeassistpro',
      features: [
        'code completion',
        'function generation',
        'comment-to-code conversion',
        'multiple language support',
        'IDE integration'
      ],
      technical_specs: [
        'Built with modern development frameworks',
        'API available for integration',
        'Supports VS Code, JetBrains IDEs, Neovim and more',
        'Real-time collaboration features',
        'Enterprise-grade security'
      ],
      gallery: [
        'https://images.unsplash.com/photo-1617791160536-598cf32026fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      ],
      pricing: {
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
      }
    };
    
    console.log('Inserting sample agent...');
    const agentResult = await client.query(insertAgentQuery, [
      agentData.name,
      agentData.slug,
      agentData.tagline,
      agentData.description,
      agentData.website_url,
      agentData.category,
      agentData.pricing_type,
      agentData.status,
      agentData.average_rating,
      agentData.total_reviews,
      agentData.developer,
      agentData.launch_date,
      agentData.homepage_image_url,
      agentData.contact_email,
      agentData.repository_url,
      agentData.documentation_url,
      agentData.linkedin_url,
      agentData.twitter_url,
      agentData.features,
      agentData.technical_specs,
      agentData.gallery,
      JSON.stringify(agentData.pricing) // Convert to JSON string
    ]);
    
    const agentId = agentResult.rows[0].id;
    console.log(`✅ Successfully inserted agent with ID: ${agentId}`);
    
    // 2. Insert some sample reviews
    const insertReviewQuery = `
      INSERT INTO agent_reviews (
        agent_id,
        user_id,
        rating,
        comment,
        created_at
      ) VALUES ($1, $2, $3, $4, $5);
    `;
    
    const reviews = [
      {
        user_id: 'user-1',
        rating: 5,
        comment: 'This tool has significantly improved my coding speed and quality. The AI suggestions are spot on!',
        created_at: new Date('2023-02-15')
      },
      {
        user_id: 'user-2',
        rating: 4,
        comment: 'Great tool overall, but sometimes the suggestions are a bit off. Still very useful for daily coding tasks.',
        created_at: new Date('2023-03-10')
      },
      {
        user_id: 'user-3',
        rating: 5,
        comment: 'The best AI coding assistant I\'ve used. The code completion is incredibly accurate and saves me hours of work.',
        created_at: new Date('2023-04-05')
      }
    ];
    
    console.log('Inserting sample reviews...');
    for (const review of reviews) {
      await client.query(insertReviewQuery, [
        agentId,
        review.user_id,
        review.rating,
        review.comment,
        review.created_at
      ]);
    }
    
    console.log('✅ Successfully inserted sample reviews');
    
    // 3. Insert some sample FAQs
    const insertFaqQuery = `
      INSERT INTO faqs (
        agent_id,
        question,
        answer,
        created_at
      ) VALUES ($1, $2, $3, $4);
    `;
    
    const faqs = [
      {
        question: 'What IDEs does CodeAssist Pro support?',
        answer: 'CodeAssist Pro currently supports VS Code, JetBrains IDEs (IntelliJ, WebStorm, PyCharm, etc.), and Neovim. We are working on adding support for more IDEs in the future.',
        created_at: new Date('2023-02-01')
      },
      {
        question: 'Is there a free trial available?',
        answer: 'Yes, we offer a free tier with basic features. You can upgrade to a paid plan at any time to unlock advanced features and higher usage limits.',
        created_at: new Date('2023-02-02')
      },
      {
        question: 'How does the AI learn my coding style?',
        answer: 'CodeAssist Pro analyzes your codebase to understand your coding patterns, naming conventions, and style preferences. The more you use it, the better it becomes at suggesting code that matches your style.',
        created_at: new Date('2023-02-03')
      }
    ];
    
    console.log('Inserting sample FAQs...');
    for (const faq of faqs) {
      await client.query(insertFaqQuery, [
        agentId,
        faq.question,
        faq.answer,
        faq.created_at
      ]);
    }
    
    console.log('✅ Successfully inserted sample FAQs');
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully');
    
    // Fetch and display the inserted agent
    const getAgentQuery = `
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM agent_reviews WHERE agent_id = a.id) as review_count,
        (SELECT COUNT(*) FROM faqs WHERE agent_id = a.id) as faq_count
      FROM ai_agents a
      WHERE a.id = $1;
    `;
    
    const agentResult2 = await client.query(getAgentQuery, [agentId]);
    console.log('\n=== Inserted Agent ===');
    console.log(JSON.stringify(agentResult2.rows[0], null, 2));
    
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error('Error inserting sample agent:', error);
  } finally {
    await client.end();
    console.log('\nConnection closed');
  }
}

insertSampleAgent();
