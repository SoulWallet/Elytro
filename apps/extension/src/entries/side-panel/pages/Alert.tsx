import { useApproval } from '../contexts/approval-context';
import { ethErrors } from 'eth-rpc-errors';
import Spin from '@/components/Spin';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UnSupportedMethod } from '@/background/provider/rpcFlow/checkMethodExist';

export default function Connect() {
  const { approval, reject } = useApproval();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (approval?.data?.options) {
      setLoading(false);
    }
  }, [approval]);
  if (!approval || !approval.data) {
    return <Spin isLoading={loading} />;
  }

  const {
    data: { dApp, options },
  } = approval;

  const handleReject = () => {
    reject(ethErrors.provider.userRejectedRequest());
    window.close();
  };
  return (
    <div className="w-full h-full flex justify-center items-center min-h-screen p-4">
      <Card className="w-full h-full flex flex-col justify-between border-none rounded-none shadow-none">
        <CardContent className="flex flex-col p-6 text-center">
          <div className="flex justify-center mb-2">
            <Avatar className="w-16 h-16 z-10 rounded-none">
              <AvatarImage src={dApp.icon} alt={`${dApp.name} icon`} />
              <AvatarFallback>{dApp.name}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mb-6">
            <div className="text-3xl font-medium mb-2">{dApp.name}</div>
            <div className="text-gray-300 text-lg font-normal">
              {dApp.origin}
            </div>
          </div>
          <div className="text-lg font-medium">
            The Dapp called {(options as UnSupportedMethod).name} failed, the
            reason is {(options as UnSupportedMethod).reason}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between space-x-4">
          <Button className="flex-1" onClick={handleReject}>
            Got it!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
