import useKeyringStore from '@/stores/keyring';

export default function Activate() {
  const { isActivated } = useKeyringStore();

  return <div>{isActivated ? 'Activated' : 'Not Activated'}</div>;
}
