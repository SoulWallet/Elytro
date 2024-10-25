import { useEffect, useState } from 'react';
import TabLayout from '../components/TabLayout';
import { Address, PrepareTransactionRequestReturnType } from 'viem';
import { Button } from '@/components/ui/button';
import _omitBy from 'lodash/omitBy';
import _isEmpty from 'lodash/isEmpty';
import { useWallet } from '@/contexts/wallet';

function SendTransaction() {
  const wallet = useWallet();
  const [request, setRequest] = useState<PrepareTransactionRequestReturnType>();
  const [isSigned, setIsSigned] = useState(false);
  const [txHash, setTxHash] = useState<Address | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  // TODO: repeat prepare tx for showing lastest gas estimation
  const prepareTransactionRequest = async (params: unknown[]) => {
    // TODO: use real wallet
    // // @ts-ignore: Unnecessary try/catch wrapper
    // try {
    //   if (params && params.length) {
    //     const requestParams = params[0] as unknown as { value: number };
    //     const args = {
    //       ..._omitBy(
    //         {
    //           ...requestParams,
    //         },
    //         _isEmpty
    //       ),
    //       value: BigInt(requestParams?.value * 1e18),
    //       account: keyring.owner as Account,
    //       type: 'eip1559',
    //     };
    //     const req = await wallet.prepareTransactionRequest(
    //       args as SendTransactionParameters
    //     );
    //     const balance = await wallet.getBalance();
    //     setRequest(req);
    //     setBalance((Number(balance) / 1e18).toString());
    //   }
    // } catch (err) {
    //   console.log(err);
    //   throw err;
    // }
  };

  const signAndSend = async () => {
    // TODO: use real wallet
    // try {
    //   setIsLoading(true);
    //   const serializedTransaction = await wallet.signTransaction(request);
    //   if (serializedTransaction) {
    //     const hash = await wallet.sendRawTransaction(serializedTransaction);
    //     setIsLoading(false);
    //     setTxHash(hash);
    //     setIsSigned(true);
    //   }
    // } catch (err) {
    //   console.log(err);
    //   throw err;
    // }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (port) {
      if (port.request) {
        prepareTransactionRequest(port.request);
      }
    });
  }, []);
  if (!request)
    return (
      <TabLayout>
        <div>Loading Request</div>
      </TabLayout>
    );
  return (
    <TabLayout>
      <div className="flex flex-col space-y-2 select-text">
        {!isSigned ? (
          <>
            <h3 className="text-lg text-center">Tx details</h3>
            {/* TODO: add chain info */}
            {/* <div>Chain: {wallet.chain.name}</div> */}
            <div>Balance: {balance} ETH</div>
            <div>From: {request.from}</div>
            <div>To: {request.to}</div>
            <div>Gas Estimate: {request.gas.toString()}</div>
            <div>Amount: {Number(request.value) / 1e18} ETH</div>
            <div className="flex flex-row justify-between space-x-2">
              <Button className="flex-1" variant="outline">
                Cancel
              </Button>
              <Button
                onClick={signAndSend}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Sending' : 'Sign & Send'}
              </Button>
            </div>
          </>
        ) : (
          <div>Tx sent, tx hash: {txHash}</div>
        )}
      </div>
    </TabLayout>
  );
}

export default SendTransaction;
