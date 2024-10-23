import EmptyAsset from '@/components/EmptyAsset';
import BasicAccountInfo from '../components/BasicAccountInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TokenList from '@/components/TokenList';
import Spin from '@/components/Spin';
import Activities from '../containers/Activities';
import { useAccount } from '../contexts/account-context';

export default function Dashboard() {
  const { loading, accountInfo } = useAccount();

  const isEmpty = false; // todo: make it real

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <Spin isLoading={loading} />

      {/* Account Basic Info */}
      <BasicAccountInfo {...accountInfo} />

      {/* Empty Fallback or Assets and Activities */}
      <div className="h-full px-2">
        <div className="h-full bg-white rounded-3xl ">
          {isEmpty ? (
            <EmptyAsset />
          ) : (
            <Tabs defaultValue="assets" className="px-4">
              <TabsList>
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              <div className="flex flex-col">
                <TabsContent value="assets">
                  <TokenList
                    /** mock data here. just for ui test */
                    data={[
                      {
                        name: 'ETH',
                        balance: '1.00',
                        price: '$1,000.00',
                        icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501425',
                      },
                      {
                        name: 'USDC',
                        balance: '123123',
                        price: '$123,123.00',
                        icon: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694',
                      },
                    ]}
                  />
                </TabsContent>
                <TabsContent value="activities">
                  <Activities />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
