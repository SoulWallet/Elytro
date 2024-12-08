import LabelValue from '../LabelValue';
import { formatAddressToShort } from '@/utils/format';

interface IDomainDetail {
  message: string;
}

const FieldRender = ({ label, value }: { label: string; value: string }) => {
  let renderValue;

  switch (label) {
    case 'chainId':
      // renderValue = chainIdToChainNameMap[Number(value)] || '--';
      // TODO: get chain name from chain config
      renderValue = value || '--';
      break;
    case 'verifyingContract':
      renderValue = (
        <div title={value}>{formatAddressToShort(value as string)}</div>
      );
      break;
    default:
      renderValue = value || '--';
  }

  return <LabelValue label={label} value={renderValue} />;
};

export default function DomainDetail({ message }: IDomainDetail) {
  const domain = JSON.parse(message).domain as EIP712Domain;

  if (!domain) {
    return null;
  }

  return (
    <div className="text-sm text-gray-500 mb-3 space-y-1">
      {Object.entries(domain).map(([key, value]) => (
        <FieldRender key={key} label={key} value={value as string} />
      ))}
    </div>
  );
}
