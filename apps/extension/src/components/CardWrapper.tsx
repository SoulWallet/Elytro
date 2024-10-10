import React from 'react';

export default function CardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white rounded-2xl p-6">{children}</div>;
}
