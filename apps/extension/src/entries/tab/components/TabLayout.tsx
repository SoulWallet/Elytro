import React from 'react';

interface TabLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function TabLayout({ children, footer }: TabLayoutProps) {
  return (
    <div className="w-full h-full bg-[#dcdcdc] flex flex-col items-center justify-center">
      <header className="fixed top-4 left-4">Elytro</header>
      <main className="rounded-super p-6 bg-white ">{children}</main>
      {footer && (
        <footer className="flex gap-4 items-center mt-6">{footer}</footer>
      )}
    </div>
  );
}

export default TabLayout;
