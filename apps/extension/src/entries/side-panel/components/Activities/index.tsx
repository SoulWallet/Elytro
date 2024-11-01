import { useEffect, useState } from 'react';
import DailyActivities, { DailyActivitiesProps } from './DailyActivities';
import { ActivityTypes } from './Activity';
import EmptyTip from '@/components/EmptyTip';

export default function Activities() {
  const mockdata = [
    {
      date: '2024/05/24',
      activities: [
        {
          id: '1',
          type: ActivityTypes.send,
          info: {},
        },
        {
          id: '2',
          type: ActivityTypes.receive,
          info: {},
        },
        {
          id: '3',
          type: ActivityTypes.callContract,
          info: {},
        },
        {
          id: '4',
          type: ActivityTypes.send,
          info: {},
        },
      ],
    },
  ];
  const [activities, setActivities] = useState<DailyActivitiesProps[]>([]);
  const getActivities = async () => {
    setTimeout(() => setActivities(mockdata as DailyActivitiesProps[]), 500);
  };
  useEffect(() => {
    getActivities();
  }, []);
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
