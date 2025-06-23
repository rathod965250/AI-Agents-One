import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [supportEmail, setSupportEmail] = useState('hello@aiagentsone.in');

  useEffect(() => {
    const fetchSupportEmail = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'support_email')
          .single();
        
        if (data && !error) {
          setSupportEmail(data.value);
        }
      } catch (error) {
        console.error('Error fetching support email:', error);
      }
    };

    fetchSupportEmail();
  }, []);

  const footerSections = [
    {
      title: 'AI Agents Directory',
      links: [
        { name: 'Browse All Agents', href: '/browse' },
        { name: 'Submit Agent', href: '/submit' }
      ]
    },
    {
      title: 'Popular Categories',
      links: [
        { name: 'Conversational AI', href: '/browse?category=conversational_ai' },
        { name: 'Productivity', href: '/browse?category=productivity' },
        { name: 'Customer Service', href: '/browse?category=customer_service' },
        { name: 'Content Creation', href: '/browse?category=content_creation' },
        { name: 'Code Assistant', href: '/browse?category=code_assistant' },
        { name: 'Analytics', href: '/browse?category=analytics' }
      ]
    },
    {
      title: 'Account & Tools',
      links: [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My Submissions', href: '/dashboard?tab=submissions' },
        { name: 'My Reviews', href: '/dashboard?tab=reviews' },
        { name: 'My Favorites', href: '/dashboard?tab=favorites' },
        { name: 'Profile Settings', href: '/dashboard?tab=profile' },
        { name: 'Sign In', href: '/auth' }
      ]
    }
  ];

  return (
    <footer className="bg-white/70 backdrop-blur-sm border-t border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        {/* <div className="mb-12">
          <NewsletterSignup />
        </div> */}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-blue-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Agents One
                </span>
                <span className="text-xs text-gray-500">Your trusted AI agents directory</span>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © 2024 AI Agents One. All rights reserved.
            </p>

            {/* Support Email */}
            <div className="flex gap-4">
              <a
                href={`mailto:${supportEmail}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Email Support"
                title={`Email us at ${supportEmail}`}
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
