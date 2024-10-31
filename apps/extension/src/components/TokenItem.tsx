export interface TokenItemProps {
  name: string;
  balance: string;
  price: string;
  icon: string;
}

export default function TokenItem({
  name,
  balance,
  price,
  icon,
}: TokenItemProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-x-2">
        <img src={icon} alt={name} className="w-8 h-8" />
        <p className="text-2xl font-medium">{name}</p>
      </div>
      <div className="flex flex-col items-end gap-x-2">
        <p className="text-2xl font-medium text-gray-900">{balance}</p>
        <p className="text-sm font-medium text-gray-300">${price}</p>
      </div>
    </div>
  );
}
