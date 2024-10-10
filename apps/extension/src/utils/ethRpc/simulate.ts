import { query } from '@/requests';
import { query_simulated_op } from '@/requests/query';
import { paddingBytesToEven } from '../format';
import { Hex, toHex } from 'viem';

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
  entryPoint: string
  // chain: string // chain name
) => {
  try {
    const res = (await query(query_simulated_op, {
      chain: 'optimism-sepolia', // todo: change it to chain id when backend is ready
      request: {
        entryPoint,
        userOps: [
          {
            callData: paddingBytesToEven(userOp.callData),
            callGasLimit: toHex(userOp.callGasLimit),
            factory: userOp.factory,
            factoryData: paddingBytesToEven(userOp.factoryData),
            maxFeePerGas: toHex(userOp.maxFeePerGas),
            maxPriorityFeePerGas: toHex(userOp.maxPriorityFeePerGas),
            nonce: toHex(userOp.nonce),
            paymaster: userOp.paymaster,
            paymasterData: paddingBytesToEven(userOp.paymasterData),
            paymasterPostOpGasLimit: userOp.paymasterPostOpGasLimit
              ? toHex(userOp.paymasterPostOpGasLimit)
              : null,
            paymasterVerificationGasLimit: userOp.paymasterVerificationGasLimit
              ? toHex(userOp.paymasterVerificationGasLimit)
              : null,
            preVerificationGas: toHex(userOp.preVerificationGas),
            sender: userOp.sender,
            signature: userOp.signature,
            verificationGasLimit: toHex(userOp.verificationGasLimit),
          },
        ],
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
