import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApproval } from '../contexts/approval-context';
import { useAccount } from '../contexts/account-context';
import { useWallet } from '@/contexts/wallet';
import { ethErrors } from 'eth-rpc-errors';
const LabelValue = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
};

export default function Connect() {
  const wallet = useWallet();
  const { approval } = useApproval();
  const {
    accountInfo: { chainType },
  } = useAccount();

  if (!approval || !approval.data) {
    return null;
  }

  const {
    data: { dApp },
  } = approval;

  const handleConnect = async () => {
    try {
      await wallet.connectWallet(dApp, chainType);
      approval.resolve();
    } catch (error) {
      approval.reject(error);
    } finally {
      window.close();
    }
  };

  const handleReject = () => {
    approval.reject(ethErrors.provider.userRejectedRequest());
    window.close();
  };

  return (
    <div className="w-full h-full flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Avatar className="w-16 h-16 mx-auto mb-4">
            <AvatarImage src={dApp.icon} alt={`${dApp.name} icon`} />
            <AvatarFallback>{dApp.name}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{dApp.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <LabelValue label="Chain" value={chainType} />
            <LabelValue label="Origin" value={dApp.origin || '--'} />
            <Button className="w-full" onClick={handleConnect}>
              Connect Wallet
            </Button>

            <Button variant="outline" className="w-full" onClick={handleReject}>
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
