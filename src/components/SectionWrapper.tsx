
import React from 'react';

interface SectionWrapperProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 md:p-8 shadow-2xl my-8 ${className}`}>
      <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500 mb-1">{title}</h3>
      <p className="text-gray-400 mb-6">{subtitle}</p>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
