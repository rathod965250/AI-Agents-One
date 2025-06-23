import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, BookText, Github, Linkedin, Twitter } from "lucide-react";
import type { Agent } from '@/integrations/supabase/types';

interface AgentHeroSectionProps {
  agent: Agent;
}

const AgentHeroSection = ({ agent }: AgentHeroSectionProps) => {
  return (
    <div className="max-w-3xl mx-auto mt-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row items-stretch p-6 gap-6 border border-blue-100">
        {/* Left: Logo, Name, Tagline, Summary */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            {agent.logo_url ? (
              <img
                src={agent.logo_url}
                alt={agent.name + ' logo'}
                className="w-14 h-14 rounded-full object-cover border border-blue-200 bg-white"
              />
            ) : (
              <img
                src={'/placeholder.svg'}
                alt={agent.name}
                className="w-14 h-14 rounded-full object-cover border border-blue-200 bg-white"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-blue-900">{agent.name}</h1>
              <p className="text-blue-700 text-sm">{agent.tagline}</p>
            </div>
          </div>
          <p className="text-gray-700 mt-2">{agent.short_description || agent.description?.slice(0, 120)}</p>
          <a
            href={agent.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4"
          >
            <Button variant="default" className="bg-blue-600 text-white hover:bg-blue-700">
              Visit {agent.name}
            </Button>
          </a>
        </div>
        {/* Right: Links */}
        <div className="bg-blue-50 rounded-xl p-4 min-w-[180px] flex flex-col gap-2 self-center border border-blue-100">
          <span className="text-blue-700 text-xs font-semibold mb-2">Links</span>
          {agent.website_url && (
            <a href={agent.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-2">
              <Globe className="h-4 w-4" /> Website
            </a>
          )}
          {agent.documentation_url && (
            <a href={agent.documentation_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-2">
              <BookText className="h-4 w-4" /> Docs
            </a>
          )}
          {agent.repository_url && (
            <a href={agent.repository_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-2">
              <Github className="h-4 w-4" /> GitHub
            </a>
          )}
          {agent.linkedin_url && (
            <a href={agent.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          )}
          {agent.twitter_url && (
            <a href={agent.twitter_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-2">
              <Twitter className="h-4 w-4" /> Twitter
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentHeroSection;
