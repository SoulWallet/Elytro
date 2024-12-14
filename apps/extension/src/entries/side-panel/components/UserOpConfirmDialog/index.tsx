// import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
// import { LoaderCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { UserOpDetail } from './UserOpDetail';
// import { useMemo, useState } from 'react';
// import { useChain } from '../../contexts/chain-context';
// import { useWallet } from '@/contexts/wallet';
// import { toast } from '@/hooks/use-toast';
// import { formatObjectWithBigInt } from '@/utils/format';
// import { navigateTo } from '@/utils/navigation';
// import { SIDE_PANEL_ROUTE_PATHS } from '../../routes';

// const PackingTip = () => {
//   return (
//     <div className="flex flex-col items-center gap-y-sm py-lg">
//       <div className="bg-blue rounded-pill p-md">
//         <LoaderCircle
//           className="size-12 animate-spin"
//           stroke="#fff"
//           strokeOpacity={0.9}
//         />
//       </div>
//       <div className="elytro-text-bold-body">Preparing the send package</div>
//       <div className="elytro-text-tiny-body text-gray-600">
//         This may take up to 5 seconds
//       </div>
//     </div>
//   );
// };

// export function UserOpConfirmDialog() {
//   const {
//     isUserOpConfirmDialogVisible,
//     opType,
//     isPacking,
//     closeUserOpConfirmDialog,
//     hasSufficientBalance,
//     userOp,
//     calcResult,
//     decodedDetail,
//   } = useDialog();
//   const { currentChain } = useChain();
//   const wallet = useWallet();
//   const [isSending, setIsSending] = useState(false);

//   const renderContent = useMemo(() => {
//     if (isPacking) return <PackingTip />;

//     if (opType && userOp)
//       return (
//         <UserOpDetail
//           opType={opType}
//           userOp={userOp}
//           calcResult={calcResult}
//           chainId={currentChain!.chainId}
//           decodedUserOp={decodedDetail}
//         />
//       );

//     return 'No user operation';
//   }, [isPacking, opType, userOp]);

//   const handleConfirm = async () => {
//     try {
//       setIsSending(true);

//       let currentUserOp = userOp;

//       // TODO: check this logic
//       if (!currentUserOp?.paymaster) {
//         currentUserOp = await wallet.estimateGas(currentUserOp!);
//       }

//       const { signature, opHash } = await wallet.signUserOperation(
//         formatObjectWithBigInt(currentUserOp!)
//       );

//       currentUserOp!.signature = signature;

//       // const simulationResult =
//       //   await elytroSDK.simulateUserOperation(currentUserOp);
//       // const txDetail = formatSimulationResultToTxDetail(simulationResult);

//       await wallet.sendUserOperation(currentUserOp!);

//       // TODO: what to do if op is a batch of txs?
//       if (decodedDetail) {
//         wallet.addNewHistory({
//           opHash,
//           timestamp: Date.now(),
//           from: userOp!.sender,
//           to: decodedDetail.to,
//           method: decodedDetail.method,
//           value: decodedDetail.value.toString(),
//         });
//       }

//       await toast({
//         title: 'Transaction sent successfully',
//         description: 'User operation hash: ' + opHash,
//       });

//       navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard, {
//         activating: opType as unknown as string,
//       });

//       closeUserOpConfirmDialog();
//     } catch (error) {
//       toast({
//         title: 'Failed to send transaction',
//         description:
//           (error as Error).message ||
//           String(error) ||
//           'Unknown error, please try again',
//       });
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <Dialog modal={false} open={isUserOpConfirmDialogVisible}>
//       <DialogContent showCloseButton={false}>
//         {renderContent}

//         <DialogFooter className="flex w-full mt-auto">
//           <div className="flex w-full gap-x-2">
//             <Button
//               variant="ghost"
//               onClick={closeUserOpConfirmDialog}
//               className="flex-1 rounded-md border border-gray-200"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleConfirm}
//               className="flex-1 rounded-md"
//               disabled={isPacking || !hasSufficientBalance || isSending}
//             >
//               {isPacking
//                 ? 'Packing...'
//                 : hasSufficientBalance
//                   ? isSending
//                     ? 'Confirming...'
//                     : 'Confirm'
//                   : 'Insufficient balance'}
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
