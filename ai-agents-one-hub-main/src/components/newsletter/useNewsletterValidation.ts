
import { useState } from 'react';

export const useNewsletterValidation = () => {
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    setError("");

    if (!email) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const clearError = () => {
    setError("");
  };

  return {
    error,
    validateEmail,
    clearError,
    setError
  };
};
