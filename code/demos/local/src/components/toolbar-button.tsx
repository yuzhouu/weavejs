import React from 'react';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  label?: React.ReactNode;
}

export function ToolbarButton({
  icon,
  active = false,
  disabled = false,
  onClick,
  className = '',
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex
        items-center
        justify-center
        w-[40px]
        h-[40px]
        rounded-full
        transition-all
        hover:bg-gray-100
        ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon}
    </button>
  );
}
