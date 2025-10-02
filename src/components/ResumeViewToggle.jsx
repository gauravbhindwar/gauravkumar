'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ResumeViewToggle = ({ onResumeTypeChange, currentType = 'both' }) => {
  const [resumeType, setResumeType] = useState(currentType);

  const handleToggle = (type) => {
    setResumeType(type);
    if (onResumeTypeChange) {
      onResumeTypeChange(type);
    }
  };

  const resumeOptions = [
    {
      key: 'fullstack',
      label: 'Full Stack Developer',
      icon: '💻',
      description: 'Focus on MERN stack, web development, and system design',
      color: 'primary'
    },
    {
      key: 'ai',
      label: 'AI Engineer',
      icon: '🤖',
      description: 'Emphasis on GenAI, LLM, and machine learning projects',
      color: 'secondary'
    },
    {
      key: 'both',
      label: 'Full Stack + AI',
      icon: '🚀',
      description: 'Complete portfolio showcasing both skill sets',
      color: 'accent'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-base-100 rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">
          Choose Your Resume View
        </h3>
        <p className="text-base-content/70">
          Customize the portfolio to highlight specific expertise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resumeOptions.map((option) => (
          <motion.button
            key={option.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleToggle(option.key)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              resumeType === option.key
                ? `border-${option.color} bg-${option.color}/10`
                : 'border-base-300 hover:border-base-400'
            }`}
          >
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{option.icon}</span>
              <h4 className={`font-bold ${
                resumeType === option.key ? `text-${option.color}` : 'text-base-content'
              }`}>
                {option.label}
              </h4>
            </div>
            <p className="text-sm text-base-content/70">
              {option.description}
            </p>
            
            {resumeType === option.key && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-3 flex items-center"
              >
                <span className={`text-${option.color} text-sm font-medium`}>
                  ✓ Active View
                </span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-base-content/60">
          The content and sections will be filtered based on your selection
        </p>
      </div>
    </motion.div>
  );
};

export default ResumeViewToggle;