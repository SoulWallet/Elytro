import React from 'react';
import TabLayout from '../components/TabLayout';
import { SOCIAL_MEDIA_LINKS } from '@/constants/social-media';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { TAB_ROUTE_PATHS } from '../routes';
import { navigateTo } from '@/utils/navigation';
import Slogan from '@/components/Slogan';

const SocialMediaIcon: React.FC<{
  name: string;
  url: string;
  icon: string;
}> = ({ name, url, icon }) => {
  return (
    <a key={name} href={url} target="_blank" rel="noreferrer">
      <img src={icon} alt={name} className="w-6 h-6" />
    </a>
  );
};

const Launch: React.FC = () => {
  return (
    <TabLayout
      footer={
        <>
          {SOCIAL_MEDIA_LINKS.map(({ name, url, icon }) => (
            <SocialMediaIcon key={name} name={name} url={url} icon={icon} />
          ))}
        </>
      }
    >
      <div className="p-6 text-gray-900 min-w-max">
        <Slogan />
        <p className="mt-6 opacity-60 text-lg">
          Setup up new account to receive 10 USDC
        </p>

        <div className="mt-10">
          <Button
            className="rounded-full w-full px-4 py-5 h-14 mb-4 font-medium text-lg leading-6"
            onClick={() => {
              navigateTo('tab', TAB_ROUTE_PATHS.Create);
            }}
          >
            Create wallet for free
          </Button>
          <p className="text-center elytro-text-small-body text-gray-750">
            Used to have an account?{' '}
            <Link href={TAB_ROUTE_PATHS.Recover}>Recover here</Link>
          </p>
        </div>
      </div>
    </TabLayout>
  );
};

export default Launch;
