import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uilnynmclpohscpsequg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbG55bm1jbHBvaHNjcHNlcXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTA4NjYsImV4cCI6MjA2NTQ2Njg2Nn0.l01ZYl5aEv8alRi_3jLwX3f0PG-sMnQMrnvsVrVdsH0';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function updateSampleAgent() {
  try {
    console.log('Updating sample agent with complete data...');
    
    // First, get an existing agent to update
    const { data: agents, error: fetchError } = await supabase
      .from('ai_agents')
      .select('id')
      .limit(1);
    
    if (fetchError) throw fetchError;
    if (!agents || agents.length === 0) {
      console.log('No agents found to update. Please create an agent first.');
      return;
    }
    
    const agentId = agents[0].id;
    
    // Sample data that matches the UI requirements
    const updateData = {
      // Basic Info
      name: 'CodeAssist Pro',
      tagline: 'AI-powered coding assistant for developers',
      description: 'CodeAssist Pro is an advanced AI coding assistant that helps developers write better code faster. With intelligent code completion, bug detection, and automated refactoring, it integrates seamlessly with your favorite IDEs.',
      category: 'Development',
      website_url: 'https://codeassist.pro',
      pricing_type: 'freemium',
      
      // Features & Details
      features: [
        'Code completion',
        'Function generation',
        'Comment-to-code conversion',
        'Multiple language support',
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
      
      // Pricing
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
      },
      
      // Reviews & Ratings
      average_rating: 4.7,
      total_reviews: 128,
      
      // Additional metadata
      developer: 'AI Innovations Inc.',
      launch_date: '2023-01-15T00:00:00Z',
      homepage_image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      
      // Contact & Social
      contact_email: 'support@codeassist.pro',
      repository_url: 'https://github.com/codeassist/codeassist-pro',
      documentation_url: 'https://docs.codeassist.pro',
      linkedin_url: 'https://linkedin.com/company/codeassist-pro',
      twitter_url: 'https://twitter.com/codeassistpro'
    };
    
    // Update the agent with the sample data
    const { data: updatedAgent, error: updateError } = await supabase
      .from('ai_agents')
      .update(updateData)
      .eq('id', agentId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    console.log('✅ Successfully updated agent with sample data:');
    console.log(JSON.stringify(updatedAgent, null, 2));
    
  } catch (error) {
    console.error('Error updating agent:', error);
  }
}

updateSampleAgent();
