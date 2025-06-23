import type { Agent } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText } from 'lucide-react';

interface CaseStudiesProps {
  agent: Agent;
}

const CaseStudies = ({ agent }: CaseStudiesProps) => {
  const caseStudies = agent.case_studies && agent.case_studies.length > 0 ? agent.case_studies : [];

  if (caseStudies.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Case Studies & Success Stories</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {caseStudies.map((study, index) => (
            <li key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border">
              <BookText className="h-6 w-6 text-indigo-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700">{study}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CaseStudies; 