
"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { NewsletterForm } from "./newsletter/NewsletterForm";
import { NewsletterSuccess } from "./newsletter/NewsletterSuccess";
import { useNewsletterValidation } from "./newsletter/useNewsletterValidation";
import { useNewsletterSubmission } from "./newsletter/useNewsletterSubmission";

export interface NewsletterSignupProps {
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { error, validateEmail, clearError, setError } = useNewsletterValidation();
  const { isSubmitting, submitEmail } = useNewsletterSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    const result = await submitEmail(email);
    
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || "An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setEmail("");
    clearError();
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (error) {
      clearError();
    }
  };

  return (
    <div
      className={`bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg ${className}`}
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <NewsletterForm
            email={email}
            onEmailChange={handleEmailChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        ) : (
          <NewsletterSuccess onReset={resetForm} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsletterSignup;
