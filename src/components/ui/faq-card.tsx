'use client';

import { Plus, Minus, LucideIcon } from 'lucide-react';
import { useState } from 'react';
import SpotlightCard from '@/components/ui/spotlight-card';

interface FAQCardProps {
  question: string;
  answer: string;
  icon: LucideIcon;
  color: string;
  isOpen?: boolean;
  onToggle?: () => void;
  controlled?: boolean; // If true, uses external state control
}

/**
 * FAQCard - A reusable FAQ card component with SpotlightCard and smooth animations
 *
 * Features:
 * - Smooth expand/collapse animation
 * - SpotlightCard integration with color theming
 * - Icon support with hover effects
 * - Can be controlled externally or manage its own state
 *
 * Usage:
 * ```tsx
 * // Self-controlled
 * <FAQCard
 *   question="How does it work?"
 *   answer="It works great!"
 *   icon={HelpCircle}
 *   color="blue"
 * />
 *
 * // Externally controlled
 * <FAQCard
 *   question="How does it work?"
 *   answer="It works great!"
 *   icon={HelpCircle}
 *   color="blue"
 *   controlled={true}
 *   isOpen={isOpen}
 *   onToggle={() => setIsOpen(!isOpen)}
 * />
 * ```
 */
export default function FAQCard({
  question,
  answer,
  icon: Icon,
  color,
  isOpen: externalIsOpen = false,
  onToggle,
  controlled = false,
}: FAQCardProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = controlled ? externalIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (controlled && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div className="group">
      <SpotlightCard
        className="border border-gray-200 bg-white transition-all duration-300"
        spotlightColor={color}
        onClick={handleToggle}>
        {/* Question Header */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 bg-${color}-100 text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white`}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-left font-semibold text-gray-900">{question}</h3>
          </div>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all duration-200 hover:bg-gray-200">
            {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>

        {/* Answer */}
        <div
          className={`mt-4 overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-left leading-relaxed text-gray-600">{answer}</p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
