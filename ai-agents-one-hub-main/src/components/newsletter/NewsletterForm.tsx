
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface NewsletterFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  error: string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  email,
  onEmailChange,
  onSubmit,
  isSubmitting,
  error
}) => {
  return (
    <motion.form
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
    >
      <div className="flex items-start justify-center gap-1 flex-col overflow-y-hidden">
        <motion.h2
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Stay Updated with AI Agents
        </motion.h2>
        <motion.p
          className="text-gray-600 text-sm"
          initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.4 }}
        >
          Subscribe to our newsletter and get the latest AI agents, updates, and exclusive content delivered to your inbox.
        </motion.p>
      </div>
      <div className="space-y-2">
        <motion.label
          initial={{ opacity: 0, filter: "blur(3px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.6 }}
          className="font-medium text-sm text-blue-700"
          htmlFor="email"
        >
          Email address
        </motion.label>
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, filter: "blur(3px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.7 }}
        >
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white/70"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative overflow-hidden text-sm flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <motion.div
              key="default"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <Send className="h-4 w-4" />
              <span className="ml-2">
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </span>
            </motion.div>
          </button>
        </motion.div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 text-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.p
        className="text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        We respect your privacy. Unsubscribe at any time.
      </motion.p>
    </motion.form>
  );
};
