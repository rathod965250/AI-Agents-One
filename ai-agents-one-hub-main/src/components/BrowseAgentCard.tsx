
import AgentCardSimple from './AgentCardSimple';
import { Tables } from '@/integrations/supabase/types';

const BrowseAgentCard = ({ agent }: { agent: Tables<'ai_agents'> }) => (
  <AgentCardSimple agent={agent} />
);

export default BrowseAgentCard;
