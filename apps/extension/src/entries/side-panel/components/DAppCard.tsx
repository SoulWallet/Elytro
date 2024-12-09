import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface IDAppDetail {
  dApp: Nullable<TDAppInfo>;
}

export default function DAppDetail({ dApp }: IDAppDetail) {
  if (!dApp) return null;

  return (
    <div className="flex items-center bg-gray-150">
      <span className="flex items-center gap-x-xs">
        <Avatar className="size-8">
          <AvatarImage src={dApp.icon} alt={`${dApp.name} logo`} />
          <AvatarFallback>{dApp.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <span className="elytro-text-bold-body">{dApp.name}</span>
      </span>

      <span className="elytro-text-smaller-bold text-gray-650">
        {dApp.origin}
      </span>
    </div>
  );
}
