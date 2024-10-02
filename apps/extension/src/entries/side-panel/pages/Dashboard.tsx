import { useEffect } from 'react';
import useAccountStore from '../stores/account';
import BasicAccountInfo from '../components/BasicAccountInfo';

export default function Dashboard() {
  const { resetFromKeyring } = useAccountStore();

  useEffect(() => {
    resetFromKeyring();
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <BasicAccountInfo />
    </div>
  );
}
