import type { ReactNode } from 'react';

interface InputWithIconProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

export default function InputWithIcon({ icon, label, children }: InputWithIconProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}
