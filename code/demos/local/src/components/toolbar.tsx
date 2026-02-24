import React from 'react';

interface ToolbarProps {
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

export function Toolbar({
  orientation = 'horizontal',
  children,
}: ToolbarProps) {
  return (
    <div
      className={`
        pointer-events-auto
        flex
        ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}
        gap-1
        bg-white
        rounded-full
        shadow-lg
        p-2
      `}
    >
      {children}
    </div>
  );
}
