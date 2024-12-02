import { cn } from '@/utils/shadcn/utils';
import React from 'react';

interface TabLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

function TabLayout({ children, footer, className }: TabLayoutProps) {
  return (
    <div className="w-full h-full bg-elytro-background flex flex-col items-center justify-center">
      <header className="fixed top-4 left-4">Elytro</header>
      <main className={cn('rounded-lg p-4xl bg-white', className)}>
        {children}
      </main>
      {footer && (
        <footer className="flex gap-4 items-center mt-6">{footer}</footer>
      )}
    </div>
  );
}

export default TabLayout;
