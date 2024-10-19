import { ApprovalTypeEn } from '@/constants/operations';
import {
  openPopupWindow,
  tryRemoveWindow,
  ApprovalWindowEventNameEn,
  approvalWindowEvent,
} from '@/utils/window';
import { ethErrors } from 'eth-rpc-errors';
import { v4 as UUIDv4 } from 'uuid';

const APPROVAL_TYPE_ROUTE_MAP: Record<ApprovalTypeEn, string> = {
  [ApprovalTypeEn.Unlock]: 'unlock',
  [ApprovalTypeEn.Connect]: 'connect',
  [ApprovalTypeEn.SendTx]: 'sendTx',
};

class ApprovalService {
  private _winId: Nullable<number> = null;
  private _currentApproval: Nullable<TApprovalInfo> = null;

  constructor() {
    approvalWindowEvent.on(ApprovalWindowEventNameEn.Removed, () => {
      this._rejectApproval();
    });
  }

  get currentApproval() {
    return this._currentApproval;
  }

  public async request(type: ApprovalTypeEn, data?: TApprovalData) {
    return new Promise((resolve, reject) => {
      // compose approval info
      const approval = {
        type,
        id: UUIDv4(),
        data,
        resolve: (data: unknown) => {
          resolve(data);
        },
        reject: (data: unknown) => {
          reject(data);
        },
      };

      this._currentApproval = approval;

      // open approval window
      this._openApprovalWindow(APPROVAL_TYPE_ROUTE_MAP[type]);
    });
  }

  private _openApprovalWindow = async (path: string) => {
    tryRemoveWindow(this._winId);
    this._winId = (await openPopupWindow(path)) || null;
  };

  private _rejectApproval = () => {
    this._currentApproval?.reject(ethErrors.provider.userRejectedRequest());
    this._currentApproval = null;
  };
}

const approvalService = new ApprovalService();

export { approvalService, ApprovalTypeEn };
