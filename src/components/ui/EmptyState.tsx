import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function EmptyState({ icon, title, description, className = '' }: EmptyStateProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-10 md:p-14 max-w-lg mx-auto text-center ${className}`}>
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 text-base md:text-lg">{description}</p>
    </div>
  );
}
