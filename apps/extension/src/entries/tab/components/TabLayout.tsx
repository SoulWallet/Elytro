import { cn } from '@/utils/shadcn/utils';
import React from 'react';
import ElytroIcon from '@/assets/logo.svg';

interface TabLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

function TabLayout({ children, footer, className }: TabLayoutProps) {
  return (
    <div className="w-full h-full elytro-gradient-bg flex flex-col items-center justify-center">
      <header className="fixed top-4 left-4 elytro-text-subtitle flex items-center gap-3xs">
        <img src={ElytroIcon} alt="Elytro" className="size-5" />
        Elytro
      </header>
      <main className={cn('rounded-lg p-3xl bg-white', className)}>
        {children}
      </main>
      {footer && (
        <footer className="flex gap-4 items-center mt-6">{footer}</footer>
      )}
    </div>
  );
}

export default TabLayout;
