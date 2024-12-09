import React, { PropsWithChildren } from 'react';

interface IInfoCardItemProps extends PropsWithChildren {
  label: string;
  children: React.ReactNode;
}

function InfoCardItem({ label, children }: IInfoCardItemProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <span className="elytro-text-smaller-bold-body text-gray-750">
        {label}
      </span>
      {children}
    </div>
  );
}

function InfoCardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full px-lg py-md bg-gray-150 rounded-sm gapy-sm">
      {children}
    </div>
  );
}
const InfoCard = { InfoCardItem, InfoCardWrapper };

export default InfoCard;
