import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Sparkles, Rocket, User, Link, FileText, Star, Wand, PictureInPicture, BookOpen, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmissionForm } from '@/hooks/useSubmissionForm';
import Navigation from '@/components/Navigation';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { TagInput } from "@/components/ui/TagInput";
import { FileUploader } from "@/components/ui/FileUploader";
import { supabase } from '@/integrations/supabase/client';
import EnhancedMetaTags from '@/components/seo/EnhancedMetaTags';
import AdvancedSEO from '@/components/seo/AdvancedSEO';

const Submit = () => {
  const { user, loading } = useAuth();
  
  const {
    formData,
    updateFormData,
    submitAgent,
    saveDraft,
    isLoading,
    errors,
    validateForm
  } = useSubmissionForm();

  const [categories, setCategories] = useState<string[]>([]);
  const [pricingTypes, setPricingTypes] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    // Fetch enum values for category and pricing_type from agent_submissions table
    const fetchEnums = async () => {
      try {
        console.log('Fetching enum values...');
        
        // Fetch agent_category from agent_submissions
        const { data: catData, error: catError } = await supabase.rpc('enum_values', { table_name: 'agent_submissions', column_name: 'category' });
        console.log('Category data:', catData, 'Category error:', catError);
        
        if (!catError && Array.isArray(catData)) {
          setCategories(catData);
        } else {
          console.error('Failed to fetch categories:', catError);
          // Fallback categories
          setCategories(['productivity', 'creative', 'development', 'business', 'education', 'healthcare', 'finance', 'marketing', 'research', 'other']);
        }
        
        // Fetch pricing_type from agent_submissions
        const { data: priceData, error: priceError } = await supabase.rpc('enum_values', { table_name: 'agent_submissions', column_name: 'pricing_type' });
        console.log('Pricing data:', priceData, 'Pricing error:', priceError);
        
        if (!priceError && Array.isArray(priceData)) {
          setPricingTypes(priceData.map((v: string) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })));
        } else {
          console.error('Failed to fetch pricing types:', priceError);
          // Fallback pricing types
          setPricingTypes([
            { value: 'free', label: 'Free' },
            { value: 'freemium', label: 'Freemium' },
            { value: 'paid', label: 'Paid' },
            { value: 'subscription', label: 'Subscription' },
            { value: 'one_time', label: 'One Time' },
            { value: 'enterprise', label: 'Enterprise' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching enum values:', error);
        // Set fallback values
        setCategories(['productivity', 'creative', 'development', 'business', 'education', 'healthcare', 'finance', 'marketing', 'research', 'other']);
        setPricingTypes([
          { value: 'free', label: 'Free' },
          { value: 'freemium', label: 'Freemium' },
          { value: 'paid', label: 'Paid' },
          { value: 'subscription', label: 'Subscription' },
          { value: 'one_time', label: 'One Time' },
          { value: 'enterprise', label: 'Enterprise' }
        ]);
      }
    };
    fetchEnums();
  }, []);

  // SEO structured data for submit page
  const submitStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Submit Your AI Agent - List Your AI Tool | AI Hub",
    "description": "Submit your AI agent or tool to our directory. Get discovered by thousands of users looking for AI solutions. Quick submission process with fast review.",
    "url": "https://ai-agents-hub.com/submit",
    "mainEntity": {
      "@type": "Service",
      "name": "AI Agent Submission Service",
      "description": "Submit and list your AI agent in our comprehensive directory",
      "provider": {
        "@type": "Organization",
        "name": "AI Agents Hub"
      }
    }
  };

  if (loading) {
    return (
      <>
        <EnhancedMetaTags
          title="Loading - Submit AI Agent | AI Hub"
          description="Loading submission form..."
          keywords="submit AI agent, loading"
          canonicalUrl="https://ai-agents-hub.com/submit"
          ogType="website"
          noIndex={true}
        />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isValid = await validateForm();
      if (!isValid) {
        toast.error('Please fill in all required fields correctly.');
        return;
      }

      const success = await submitAgent();
      if (success) {
        toast.success('Agent submitted successfully! It will be reviewed by our team.');
      } else {
        toast.error('Failed to submit agent. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting agent:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const handleSaveDraft = async () => {
    const success = await saveDraft();
    if (success) {
      toast.success('Draft saved successfully!');
    }
  };

  const handleFileChange = (file: File | null) => {
    updateFormData({ screenshotFile: file });
  };

  return (
    <>
      <EnhancedMetaTags
        title="Submit Your AI Agent | AI Hub"
        description="Showcase your creation to the world. Submit your AI agent to our directory for instant visibility and community feedback."
        keywords="submit AI agent, add AI tool, AI agent submission, AI directory, list AI tool"
        canonicalUrl="https://ai-agents-hub.com/submit"
        ogType="website"
      />
      <AdvancedSEO
        type="submit"
        data={submitStructuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Tell us about your AI Agent</h1>
            <p className="mb-8 text-gray-600">We'll use this information to create your listing and help users discover your agent.</p>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name<span className="text-red-500">*</span></Label>
                  <Input id="name" value={formData.name || ''} onChange={e => updateFormData({ name: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="website_url">Website<span className="text-red-500">*</span></Label>
                  <Input id="website_url" value={formData.website_url || ''} onChange={e => updateFormData({ website_url: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="pricing_type">Pricing Model<span className="text-red-500">*</span></Label>
                  <Select value={formData.pricing_type} onValueChange={value => updateFormData({ pricing_type: value })} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select pricing" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricingTypes.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category<span className="text-red-500">*</span></Label>
                  <Select value={formData.category} onValueChange={value => updateFormData({ category: value })} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="repository_url">Repository</Label>
                  <Input id="repository_url" value={formData.repository_url || ''} onChange={e => updateFormData({ repository_url: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn</Label>
                  <Input id="linkedin_url" value={formData.linkedin_url || ''} onChange={e => updateFormData({ linkedin_url: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="twitter_url">Twitter/X</Label>
                  <Input id="twitter_url" value={formData.twitter_url || ''} onChange={e => updateFormData({ twitter_url: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="additional_resources_url">Additional Resources</Label>
                  <Input id="additional_resources_url" value={formData.additional_resources_url || ''} onChange={e => updateFormData({ additional_resources_url: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="developer">Developer / Organization<span className="text-red-500">*</span></Label>
                  <Input id="developer" value={formData.developer || ''} onChange={e => updateFormData({ developer: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email<span className="text-red-500">*</span></Label>
                  <Input id="contact_email" value={formData.contact_email || ''} onChange={e => updateFormData({ contact_email: e.target.value })} required className="mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isLoading}>Save Draft</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit Agent'}</Button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Submit;
