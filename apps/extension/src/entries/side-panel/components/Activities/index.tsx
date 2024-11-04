import DailyActivities from './DailyActivities';
import EmptyTip from '@/components/EmptyTip';
import { useAccount } from '../../contexts/account-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function Activities() {
  const {
    activityInfo: { loadingActivities, activities },
  } = useAccount();

  if (loadingActivities)
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-[40px]" />
        <Skeleton className="w-full h-[40px]" />
        <Skeleton className="w-full h-[40px]" />
      </div>
    );
  if (!activities.length)
    return (
      <div className="flex min-h-[50vh] items-center">
        <EmptyTip tip="You don’t have any activities yet" />
      </div>
    );
  return (
    <div>
      {activities.map((item) => (
        <DailyActivities key={item.date} dailyActivities={item} />
      ))}
    </div>
  );
}
