import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedAgents from "@/components/FeaturedAgents";
import CategoriesSection from "@/components/CategoriesSection";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import SEOHead from "@/components/SEOHead";
import AdvancedSEO from "@/components/seo/AdvancedSEO";
import EnhancedMetaTags from "@/components/seo/EnhancedMetaTags";
import FAQSection from "@/components/seo/FAQSection";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Agent } from "@/integrations/supabase/types";
import NewsletterSignup from "@/components/NewsletterSignup";
import PageViewTracker from '@/components/analytics/PageViewTracker';

const Index = () => {
  const [searchResults, setSearchResults] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [agentCount, setAgentCount] = useState<number>(3500);

  useEffect(() => {
    const fetchAgentCount = async () => {
      try {
        const { count } = await supabase
          .from('ai_agents')
          .select('*', { count: 'exact', head: true })
          .in('status', ['approved', 'featured']);
        
        if (count !== null) {
          setAgentCount(count);
        }
      } catch (error) {
        console.error('Error fetching agent count:', error);
      }
    };

    fetchAgentCount();
  }, []);

  const handleSearchResults = (results: Agent[], query: string) => {
    setSearchResults(results);
    setSearchQuery(query);
  };

  // Homepage structured data
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AI Agents Directory - Find the Best AI Tools & Assistants",
    "description": "Discover, compare and find the perfect AI agents for your needs. Browse 3,500+ AI tools across productivity, creativity, and automation categories.",
    "url": "https://ai-agents-hub.com/",
    "mainEntity": {
      "@type": "ItemList",
      "name": "AI Agents Directory",
      "description": "Comprehensive directory of AI agents and tools",
      "numberOfItems": "3500+"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ai-agents-hub.com/"
      }]
    }
  };

  // Updated FAQ for homepage - aligned with AI Agents One brand and directory
  const homepageFAQData = [
    {
      question: "What is AI Agents One?",
      answer: `AI Agents One is the world's largest directory of AI tools and agents, featuring over ${agentCount.toLocaleString()}+ verified AI solutions. We help individuals and businesses discover, compare, and choose the perfect AI tools for productivity, content creation, automation, customer service, and more.`
    },
    {
      question: "How do I find the right AI agent for my specific needs?",
      answer: "Use our advanced search and filtering system to browse by category, pricing, features, and user ratings. Our directory includes detailed agent profiles with descriptions, use cases, pricing information, and genuine user reviews to help you make informed decisions."
    },
    {
      question: "Are there free AI agents available in your directory?",
      answer: "Yes! Our directory includes hundreds of free AI tools and agents across all categories. Use our pricing filter to show only free options, or explore freemium models that offer both free and premium features."
    },
    {
      question: "How often is the AI Agents Hub directory updated?",
      answer: "We update our directory daily with new AI tools and agents. Our dedicated team continuously reviews submissions, verifies agent information, and ensures all listings remain current and accurate. New AI innovations are added regularly."
    },
    {
      question: "Can I submit my own AI agent to AI Agents Hub?",
      answer: "Absolutely! We welcome submissions from AI developers and companies. Use our free submission form to add your AI tool to our directory. All submissions are reviewed by our team to ensure quality and accuracy before being published."
    },
    {
      question: "How do you ensure the quality and reliability of listed AI agents?",
      answer: "Every AI agent in our directory undergoes a review process. We verify website functionality, collect user feedback, monitor performance, and regularly update information. Our user rating and review system also helps maintain quality standards."
    }
  ];

  return (
    <>
      <PageViewTracker />
      <EnhancedMetaTags
        title="AI Agents Directory - Discover 3,500+ Best AI Tools & Assistants | AI Hub"
        description="Find the perfect AI agent for your needs. Browse chatbots, content creators, code assistants, and productivity tools. Compare features, read reviews, and discover new AI innovations daily."
        keywords="AI agents directory, artificial intelligence tools, AI marketplace, chatbots, AI assistants, productivity AI, machine learning tools, AI automation, content creation AI, code assistants"
        canonicalUrl="https://ai-agents-hub.com/"
      />

      <AdvancedSEO
        type="homepage"
        faqData={homepageFAQData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
        <Navigation />
        <HeroSection onSearchResults={handleSearchResults} />
        <FeaturedAgents searchResults={searchResults} searchQuery={searchQuery} />
        <CategoriesSection />

        {/* Guide CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 mr-3 text-gray-700" />
              <h2 className="text-2xl font-bold text-black">Learn About AI Agents</h2>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover everything you need to know about AI agents, from understanding the technology to choosing and implementing the perfect tools for your needs.
            </p>
            <Link 
              to="/guide"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-medium"
            >
              Read the Complete Guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>

        {/* FAQ Section for SEO */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <FAQSection 
            faqData={homepageFAQData}
            title="Frequently Asked Questions About AI Agents One"
          />
        </div>

        {/* Newsletter Signup - only on homepage */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <NewsletterSignup />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Index;
