import { BackArrow } from '@/assets/icons/BackArrow';
import { navigateTo } from '@/utils/navigation';
import { X } from 'lucide-react';
import React, { PropsWithChildren } from 'react';

interface ISecondaryPageWrapperProps extends PropsWithChildren {
  children: React.ReactNode;
  title: string;
  closeable?: boolean;
  footer?: React.ReactNode;
  onClose?: () => void;
  onBack?: () => void;
}

export default function SecondaryPageWrapper({
  children,
  title,
  closeable = false,
  footer,
  onClose,
  onBack,
}: ISecondaryPageWrapperProps) {
  const handleClose = () => {
    onClose?.();
    navigateTo('side-panel', '/dashboard');
  };

  const handleBack = () => {
    onBack?.();
    history.back();
  };

  return (
    <div className="w-full h-full bg-gray-150 p-sm">
      <div className="flex flex-col flex-grow w-full h-full bg-white px-lg rounded-lg">
        {/* Header: back button, title, close button */}
        <div className="flex flex-row items-center justify-center relative py-lg mb-sm">
          <BackArrow
            className="elytro-clickable-icon absolute left-0"
            onClick={handleBack}
          />
          <h3 className="elytro-text-bold-body">{title}</h3>
          {closeable && (
            <X
              className="elytro-clickable-icon absolute right-0"
              onClick={handleClose}
            />
          )}
        </div>

        {children}

        {/* Footer: fixed to bottom */}
        {footer && <div className="flex w-full mt-auto mb-md">{footer}</div>}
      </div>
    </div>
  );
}
