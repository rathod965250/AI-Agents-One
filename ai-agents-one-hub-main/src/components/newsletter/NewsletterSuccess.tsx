
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface NewsletterSuccessProps {
  onReset: () => void;
}

export const NewsletterSuccess: React.FC<NewsletterSuccessProps> = ({ onReset }) => {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Thank you for subscribing!
        </h2>
      </div>
      <p className="text-gray-600 mb-4">
        You'll receive updates about new AI agents and platform features directly in your inbox.
      </p>
      <button
        onClick={onReset}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
      >
        Subscribe another email
      </button>
    </motion.div>
  );
};
