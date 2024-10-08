import { Button, ButtonProps } from '@/components/ui/button';
import React from 'react';

interface ActionButtonProps extends ButtonProps {
  icon: React.ReactNode;
  label: string;
}

export default function ActionButton({
  icon,
  label,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      key={label}
      className="bg-blue-100 text-gray-900 hover:bg-blue-200 h-12"
      {...props}
    >
      {icon}
      {label}
    </Button>
  );
}
