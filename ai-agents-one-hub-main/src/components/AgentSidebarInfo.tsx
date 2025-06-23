import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { Twitter, Linkedin } from 'lucide-react';
import type { Agent } from "@/integrations/supabase/types";

interface AgentSidebarInfoProps {
    agent: Agent;
}

const AgentSidebarInfo = ({ agent }: AgentSidebarInfoProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-sm mb-1">Pricing</h4>
                    <Badge variant="outline" className="capitalize">{agent.pricing_type}</Badge>
                </div>
                
                <div>
                    <h4 className="font-semibold text-sm mb-1">Rating</h4>
                    <div className="flex items-center gap-2">
                        <StarRating rating={agent.average_rating || 0} />
                        <span className="text-sm text-gray-600">({agent.total_reviews || 0} reviews)</span>
                    </div>
                </div>

                {(agent.twitter_url || agent.linkedin_url) && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Social</h4>
                        <div className="flex items-center gap-4">
                            {agent.twitter_url && (
                                <a href={agent.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500">
                                    <Twitter size={20} />
                                </a>
                            )}
                            {agent.linkedin_url && (
                                <a href={agent.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                                    <Linkedin size={20} />
                                </a>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="font-semibold text-sm mb-1">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {agent.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}

export default AgentSidebarInfo; 