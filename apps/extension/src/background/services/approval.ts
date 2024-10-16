import { openPopupWindow, tryRemoveWindow } from '@/utils/window';
import { v4 as UUIDv4 } from 'uuid';

type TApprovalData = {
  test?: string;
};

type TApprovalInfo = {
  type: ApprovalTypeEn;
  id: string;
  data: TApprovalData;
};

enum ApprovalTypeEn {
  'Unlock',
  'Connect',
}

const APPROVAL_TYPE_ROUTE_MAP: Record<ApprovalTypeEn, string> = {
  [ApprovalTypeEn.Unlock]: 'unlock',
  [ApprovalTypeEn.Connect]: 'unlock',
};

class ApprovalService {
  private _winId: Nullable<number> = null;
  private _currentApproval: Nullable<TApprovalInfo> = null;

  constructor() {}

  // do NOT use getter, will encounter proxy problem
  public getCurrentApproval() {
    return this._currentApproval;
  }

  public async request(type: ApprovalTypeEn, data: TApprovalData) {
    return new Promise((resolve, reject) => {
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
      this._openApprovalWindow(APPROVAL_TYPE_ROUTE_MAP[type]);
    });
  }

  private _openApprovalWindow = async (path: string) => {
    tryRemoveWindow(this._winId);
    this._winId = (await openPopupWindow(path)) || null;
  };
}

const approvalService = new ApprovalService();

export { approvalService, ApprovalTypeEn };
