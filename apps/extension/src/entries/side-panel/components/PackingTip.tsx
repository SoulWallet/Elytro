import { LoaderCircle } from 'lucide-react';

const PackingTip = ({
  body = 'Preparing & calculating',
  subBody = 'This may take up to 15 seconds',
}: {
  body?: string;
  subBody?: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-y-sm py-lg">
      <div className="bg-blue rounded-pill p-md">
        <LoaderCircle
          className="size-12 animate-spin"
          stroke="#fff"
          strokeOpacity={0.9}
        />
      </div>
      <div className="elytro-text-bold-body">{body}</div>
      <div className="elytro-text-tiny-body text-gray-600">{subBody}</div>
    </div>
  );
};

export default PackingTip;
