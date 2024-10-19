import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ISendTxProps {
  txParams: TTransactionInfo;
  chainName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SendTxDetail({
  txParams,
  chainName,
  onConfirm,
  onCancel,
}: ISendTxProps) {
  return (
    <Card className="w-full max-w-md mx-auto flex-grow flex flex-col min-w-[430px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Confirm Transaction
        </CardTitle>
        <Badge variant="secondary">{chainName}</Badge>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        {Object.entries(txParams).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="font-medium capitalize">{key}:</span>
            <span className="text-sm break-all">{value || '--'}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 mt-auto">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </CardFooter>
    </Card>
  );
}
