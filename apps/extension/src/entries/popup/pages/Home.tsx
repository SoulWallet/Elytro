import React from 'react';
import { useLocation } from 'wouter';

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  return (
    <div
      onClick={() => {
        setLocation('/settings');
      }}
    >
      Home
    </div>
  );
};

export default Home;
