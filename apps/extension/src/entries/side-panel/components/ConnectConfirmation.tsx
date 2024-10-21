import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LogoWithCircle from '@/assets/logoWithCircle.svg';
import { CheckIcon } from 'lucide-react';

interface IProps {
  dApp: TDAppInfo;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConnectionConfirmation({
  dApp,
  onConfirm,
  onCancel,
}: IProps) {
  const tips = [
    'Access to your balance and activities',
    'Send you requests for transactions',
  ];
  return (
    <Card className="w-full h-full flex flex-col justify-between border-none rounded-none shadow-none">
      <CardHeader className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <Avatar className="w-16 h-16 relative left-4 z-10 rounded-none">
            <AvatarImage src={LogoWithCircle} alt={`${dApp.name} icon`} />
            <AvatarFallback>{dApp.name}</AvatarFallback>
          </Avatar>
          <Avatar className="w-16 h-16 relative z-0 rounded-none mr-4">
            <AvatarImage src={dApp.icon} alt={`${dApp.name} icon`} />
            <AvatarFallback>{dApp.name}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle>
          <div className="text-3xl font-medium mb-2">
            Connect to {dApp.name}
          </div>
          <div className="text-gray-300 text-lg font-normal">{dApp.origin}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col p-6">
        <ul className="space-y-2">
          {tips.map((tip) => (
            <li className="flex justify-center text-sm" key={tip}>
              <CheckIcon className="text-green-100 mr-2" />
              <div>{tip}</div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between space-x-4">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={onConfirm}>
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}
