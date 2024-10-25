import { query } from '@/requests';
import { query_simulated_op } from '@/requests/query';
import { formatHex, paddingBytesToEven } from '../format';
import { Hex } from 'viem';

type StateChangeItem = {
  address: string;
  balance: {
    previousValue: Hex;
    newValue: Hex;
  };
  nonce: {
    previousValue: Hex;
    newValue: Hex;
  };
};

type AssetChangeItem = {
  type: string;
  from: string;
  to: string;
  rawAmount: string;
};

type BalanceChangeItem = {
  address: string;
  dollarValue: string;
};

export type SimulationResult = {
  assetChanges: AssetChangeItem[];
  balanceChanges: BalanceChangeItem[];
  blockNumber: Hex;
  cumulativeGasUsed: Hex;
  gasUsed: Hex;
  stateChanges: StateChangeItem[];
  status: boolean;
  type: Hex;
};

type SimulationResponse = {
  simulate: {
    success: boolean;

    result: SimulationResult;
  };
};

export const simulateSendUserOp = async (
  userOp: ElytroUserOperation,
  entryPoint: string,
  chainID: number // chain name
) => {
  try {
    const req = [
      {
        callData: paddingBytesToEven(userOp.callData),
        callGasLimit: formatHex(userOp.callGasLimit),
        factory: userOp.factory,
        factoryData: paddingBytesToEven(userOp.factoryData),
        maxFeePerGas: formatHex(userOp.maxFeePerGas),
        maxPriorityFeePerGas: formatHex(userOp.maxPriorityFeePerGas),
        nonce: formatHex(userOp.nonce),
        paymaster: userOp.paymaster,
        paymasterData: paddingBytesToEven(userOp.paymasterData),
        paymasterPostOpGasLimit: userOp.paymasterPostOpGasLimit
          ? formatHex(userOp.paymasterPostOpGasLimit)
          : null,
        paymasterVerificationGasLimit: userOp.paymasterVerificationGasLimit
          ? formatHex(userOp.paymasterVerificationGasLimit)
          : null,
        preVerificationGas: formatHex(userOp.preVerificationGas),
        sender: userOp.sender,
        signature: userOp.signature,
        verificationGasLimit: formatHex(userOp.verificationGasLimit),
      },
    ];

    const res = (await query(query_simulated_op, {
      chainID: formatHex(chainID), // todo: change it to chain id when backend is ready
      request: {
        entryPoint,
        userOps: req,
      },
    })) as SimulationResponse;

    if (res.simulate.success) {
      return res.simulate.result;
    } else {
      throw new Error(res.simulate.result.toString());
    }
  } catch (error) {
    console.error('Elytro: Failed to simulate user operation', error);
    throw error;
  }
};
