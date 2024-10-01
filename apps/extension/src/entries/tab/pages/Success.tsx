import TabLayout from '../components/TabLayout';
import logo from '../../../../public/logo.svg';
import { ENCOURAGE_DAPPS } from '@/constants/dapps';
import { safeOpen } from '@/utils/safeOpen';

function Success() {
  return (
    <TabLayout>
      <div className="flex flex-col items-center justify-center gap-y-8">
        <img src={logo} className="w-14 h-14 m-5" />
        <div className="text-4xl font-medium">You are all set!</div>
        <div className="text-sm text-gray-400">
          Explore massive apps on Ethereum
        </div>
        {/* 2 columns, n rows, */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-8 px-16">
          {ENCOURAGE_DAPPS.map(({ name, icon, url }) => (
            <div
              key={name}
              className="flex flex-row items-center gap-x-2 cursor-pointer w-40 p-2"
              onClick={() => {
                safeOpen(url);
              }}
            >
              <img src={icon} className="w-12 h-12" />
              <div className="text-sm font-medium whitespace-nowrap">
                {name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TabLayout>
  );
}

export default Success;
