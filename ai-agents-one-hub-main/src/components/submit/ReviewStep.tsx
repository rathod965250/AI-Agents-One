
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { SubmissionFormData } from '@/hooks/useSubmissionForm';

interface ReviewStepProps {
  formData: SubmissionFormData;
  updateFormData: (updates: Partial<SubmissionFormData>) => void;
  errors: Record<string, string>;
}

const ReviewStep = ({ formData, errors }: ReviewStepProps) => {
  const hasErrors = Object.keys(errors).length > 0;

  const categoryLabels: Record<string, string> = {
    'conversational_ai': 'Conversational AI',
    'content_creation': 'Content Creation',
    'code_assistant': 'Code Assistant',
    'data_analysis': 'Data Analysis',
    'image_generation': 'Image Generation',
    'productivity': 'Productivity',
    'customer_support': 'Customer Support',
    'marketing': 'Marketing',
    'automation': 'Automation',
    'research': 'Research',
    'other': 'Other'
  };

  const pricingLabels: Record<string, string> = {
    'free': 'Free',
    'freemium': 'Freemium',
    'paid': 'Paid',
    'subscription': 'Subscription'
  };

  return (
    <div className="space-y-6">
      {hasErrors ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the errors in previous steps before submitting.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Review your submission details below. Once submitted, your agent will be reviewed by our team.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-xl">{formData.name || 'Agent Name'}</h3>
              <p className="text-gray-600">AI Agent</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Website</h4>
              <a
                href={formData.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {formData.website_url || 'Website URL'}
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Category</h4>
                <Badge variant="secondary">
                  {categoryLabels[formData.category] || 'Not selected'}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Pricing</h4>
                <Badge variant="outline">
                  {pricingLabels[formData.pricing_type] || 'Not selected'}
                </Badge>
              </div>
            </div>

            {formData.contact_email && (
              <div>
                <h4 className="font-medium mb-2">Contact Email</h4>
                <p className="text-gray-700">{formData.contact_email}</p>
              </div>
            )}

            {formData.repository_url && (
              <div>
                <h4 className="font-medium mb-2">Repository URL</h4>
                <a
                  href={formData.repository_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {formData.repository_url}
                </a>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {formData.linkedin_url && (
                <div>
                  <h4 className="font-medium mb-2">LinkedIn</h4>
                  <a
                    href={formData.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}

              {formData.twitter_url && (
                <div>
                  <h4 className="font-medium mb-2">Twitter/X</h4>
                  <a
                    href={formData.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Twitter Profile
                  </a>
                </div>
              )}
            </div>

            {formData.additional_resources_url && (
              <div>
                <h4 className="font-medium mb-2">Additional Resources</h4>
                <a
                  href={formData.additional_resources_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {formData.additional_resources_url}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>What happens next?</strong><br />
            After submission, our team will review your agent within 2-3 business days. 
            You'll receive an email notification once the review is complete. 
            You can track the status in your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default ReviewStep;
