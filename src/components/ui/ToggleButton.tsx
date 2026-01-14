interface ToggleButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export default function ToggleButton({ label, isActive, onClick, className = '' }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3.5 px-8 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      {label}
    </button>
  );
}
