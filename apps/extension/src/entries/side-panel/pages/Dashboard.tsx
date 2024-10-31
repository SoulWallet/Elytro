import BasicAccountInfo from '../components/BasicAccountInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Spin from '@/components/Spin';
import Activities from '../containers/Activities';
import { useAccount } from '../contexts/account-context';
import Assets from '../components/Assets';

export default function Dashboard() {
  const { loading } = useAccount();

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <Spin isLoading={loading} />

      {/* Account Basic Info */}
      <BasicAccountInfo />

      <div className="h-full px-2">
        <div className="h-full bg-white rounded-3xl ">
          <Tabs defaultValue="assets" className="px-4">
            <TabsList>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            <div className="flex flex-col">
              <TabsContent value="assets">
                <Assets />
              </TabsContent>
              <TabsContent value="activities">
                <Activities />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
