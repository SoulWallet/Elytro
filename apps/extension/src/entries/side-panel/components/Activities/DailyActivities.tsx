import Activity, { ActivityProps } from './Activity';

export interface DailyActivitiesProps {
  date: string;
  activities: ActivityProps[];
}

export default function DailyActivities({
  dailyActivities,
}: {
  dailyActivities: DailyActivitiesProps;
}) {
  if (!dailyActivities.activities.length) return null;
  return (
    <div>
      <div className="text-sm font-medium text-gray-500">
        {dailyActivities.date}
      </div>
      <div>
        {dailyActivities.activities.map((item) => (
          <Activity key={item.id} activity={item} />
        ))}
      </div>
    </div>
  );
}
