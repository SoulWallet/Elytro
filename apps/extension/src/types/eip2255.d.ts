/**
 * Type definitions for EIP-2255 Wallet Permissions System
 * @see https://eips.ethereum.org/EIPS/eip-2255
 */

interface PermissionRequest {
  [methodName: string]: {
    [caveatName: string]: any;
  };
}

interface WalletPermission {
  // The name of the permission
  parentCapability: string;
  // The date the permission was granted, in UNIX epoch time
  date?: number;
  // Optional invoker - a URI used to identify the source of the current dapp
  invoker?: string;
  // Optional caveats that restrict the permission (the specific restrictions applied to the permitted method)
  caveats?: PermissionCaveat[];
}

interface PermissionCaveat {
  // The type of caveat
  type: string;
  // The caveat value - structure depends on the type (arbitrary JSON value)
  value: any;
}

interface PermissionResponse {
  // The permissions that were granted
  permissions: WalletPermission[];
  // Optional metadata about the response
  metadata?: {
    [key: string]: any;
  };
}
