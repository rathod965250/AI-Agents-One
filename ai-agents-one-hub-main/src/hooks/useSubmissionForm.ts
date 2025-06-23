import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SubmissionFormData {
  name?: string;
  category?: string;
  tagline?: string;
  description?: string;
  website_url?: string;
  pricing_type?: string;
  contact_email?: string;
  repository_url?: string;
  documentation_url?: string;
  additional_resources_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  developer?: string;
  features?: string[];
  integrations?: string[];
  gallery?: string[];
  case_studies?: string[];
  technical_specs?: string[];
  screenshotFile?: File | null;
  homepage_image_url?: string;
}

interface FormErrors {
  [key: string]: string;
}

export const useSubmissionForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<SubmissionFormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (newData: Partial<SubmissionFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(newData).forEach(key => {
      if (newErrors[key]) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Agent name is required';
    }
    if (!formData.developer?.trim()) {
      newErrors.developer = 'Developer/Organization is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.website_url?.trim()) {
      newErrors.website_url = 'Website URL is required';
    } else if (!isValidUrl(formData.website_url)) {
      newErrors.website_url = 'Please enter a valid URL';
    }
    if (!formData.pricing_type) {
      newErrors.pricing_type = 'Pricing model is required';
    }
    if (!formData.contact_email?.trim()) {
      newErrors.contact_email = 'Contact email is required';
    } else if (!isValidEmail(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitAgent = async (): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    let submissionData: Partial<SubmissionFormData> = { ...formData };
    
    // 1. Handle File Upload
    if (submissionData.screenshotFile) {
      const file = submissionData.screenshotFile;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('agent-screenshots')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading screenshot:', uploadError);
        setIsLoading(false);
        return false;
      }
      
      const { data: urlData } = supabase.storage
        .from('agent-screenshots')
        .getPublicUrl(filePath);
        
      submissionData.homepage_image_url = urlData.publicUrl;
    }
    
    // 2. Prepare data for insertion (remove file object)
    delete submissionData.screenshotFile;

    // 3. Insert into database
    try {
      const { error } = await supabase
        .from('agent_submissions')
        .insert({
          ...submissionData,
          documentation_url: formData.documentation_url,
          user_id: user.id,
          is_draft: false,
          submitted_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error submitting agent:', error);
        return false;
      }

      setFormData({});
      return true;
    } catch (error) {
      console.error('Error submitting agent:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async (): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const draftData = { ...formData };
      delete draftData.screenshotFile;
      
      const { error } = await supabase
        .from('agent_submissions')
        .upsert({
          ...draftData,
          documentation_url: formData.documentation_url,
          user_id: user.id,
          is_draft: true,
        });

      if (error) {
        console.error('Error saving draft:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    updateFormData,
    submitAgent,
    saveDraft,
    isLoading,
    errors,
    validateForm,
  };
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
