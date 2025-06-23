
import { CheckCircle, ArrowRight } from 'lucide-react';

interface HowToStep {
  step: string;
  description: string;
  tips?: string[];
}

interface HowToGuideProps {
  title: string;
  steps: HowToStep[];
  className?: string;
}

const HowToGuide = ({ title, steps, className = "" }: HowToGuideProps) => {
  return (
    <section className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{step.step}</h3>
              <p className="text-gray-700 mb-3">{step.description}</p>
              {step.tips && step.tips.length > 0 && (
                <div className="bg-white rounded-md p-3 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Pro Tips:
                  </h4>
                  <ul className="space-y-1">
                    {step.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-blue-800 flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowToGuide;
