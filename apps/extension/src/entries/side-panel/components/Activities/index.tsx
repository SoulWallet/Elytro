// import DailyActivities from './DailyActivities';
import EmptyTip from '@/components/EmptyTip';
import { useAccount } from '../../contexts/account-context';
import { HistoryStatus, TxHistory } from '@/background/services/txHistory';
import { formatAddressToShort } from '@/utils/format';
import { formatEther } from 'viem';
import dayjs from 'dayjs';

const History = ({ his }: { his: TxHistory }) => {
  const StatusMap = {
    [HistoryStatus.SUCCESS]: <div className="text-green-800">Confirmed</div>,
    [HistoryStatus.DONE]: <div className="text-red-800">UnConfirmed</div>,
    [HistoryStatus.PENDING]: <div className="text-yellow-600">Pending</div>,
  };
  return (
    <div className="py-2">
      <div className="flex justify-between">
        <div className="text-lg font-bold">
          {his.historyDetail?.method?.name || his.historyDetail?.to
            ? 'Send'
            : 'Unknow Activity'}
        </div>
        {his.historyDetail?.value && (
          <div className="text-lg font-medium">
            {formatEther(BigInt(his.historyDetail?.value))} ETH
          </div>
        )}
      </div>
      <div>
        <div className="mt-2">
          {his.historyDetail?.from && (
            <div className="text-gray-400">
              From: {formatAddressToShort(his.historyDetail?.from)}
            </div>
          )}
          {his.historyDetail?.to && (
            <div className="text-gray-400">
              To: {formatAddressToShort(his.historyDetail?.to)}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        {StatusMap[his.status]}
        <div className="text-gray-400">
          {dayjs(his.timestamp).format('YYYY/MM/DD HH:mm:ss')}
        </div>
      </div>
    </div>
  );
};

export default function Activities() {
  const { history } = useAccount();

  if (!history.length)
    return (
      <div className="flex min-h-[50vh] items-center">
        <EmptyTip tip="You don’t have any activities yet" />
      </div>
    );
  return (
    <div>
      {/* {activities.map((item) => (
        <DailyActivities key={item.date} dailyActivities={item} />
      ))} */}
      {history.map((his) => (
        <History his={his} key={his.id} />
      ))}
    </div>
  );
}
