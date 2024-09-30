import React from 'react';

interface TabLayoutProps {
  children: React.ReactNode;
}

function TabLayout({ children }: TabLayoutProps) {
  return (
    <div className="w-full h-full bg-[#dcdcdc] flex flex-col items-center justify-center">
      <header className="fixed top-4 left-4">Elytro</header>
      <main className="rounded-super p-6 bg-white w-[606px] h-[540px]">
        {children}
      </main>
      <footer>{}</footer>
    </div>
  );
}

export default TabLayout;
