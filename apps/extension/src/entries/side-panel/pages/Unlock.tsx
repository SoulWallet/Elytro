import PasswordInput from '@/components/PasswordInputer';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { navigateTo } from '@/utils/navigation';
import { TAB_ROUTE_PATHS } from '@/entries/tab/routes';
import useKeyringStore from '@/stores/keyring';
import Slogan from '@/components/Slogan';

export default function Unlock() {
  const [pwd, setPwd] = useState<string>('');
  const { unlock } = useKeyringStore();

  return (
    <div className="w-full h-full flex flex-col px-8 items-center justify-center gap-y-8 bg-elytro-background min-w-80">
      <>
        <Slogan size="md" />
        <PasswordInput
          className="bg-white"
          onValueChange={(value) => {
            setPwd(value);
          }}
        />
        <Button
          className="w-full bg-white text-black rounded-full hover:bg-gray-100"
          onClick={() => unlock(pwd)}
          disabled={!pwd}
        >
          Unlock
        </Button>
        <div className="text-sm text-[#32417]}">
          Can’t access account?{' '}
          <a
            className="font-semibold cursor-pointer"
            onClick={() => navigateTo('tab', TAB_ROUTE_PATHS.Recover)}
          >
            Recover here
          </a>
        </div>
      </>
    </div>
  );
}
