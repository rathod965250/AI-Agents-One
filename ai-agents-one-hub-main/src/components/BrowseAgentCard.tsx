import AgentCardSimple from './AgentCardSimple';
import { Agent } from '@/integrations/supabase/types';

const BrowseAgentCard = ({ agent }: { agent: Agent }) => (
  <AgentCardSimple agent={agent} />
);

export default BrowseAgentCard;
