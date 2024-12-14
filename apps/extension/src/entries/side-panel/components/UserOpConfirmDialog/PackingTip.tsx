import { LoaderCircle } from 'lucide-react';

const PackingTip = () => {
  return (
    <div className="flex flex-col items-center gap-y-sm py-lg">
      <div className="bg-blue rounded-pill p-md">
        <LoaderCircle
          className="size-12 animate-spin"
          stroke="#fff"
          strokeOpacity={0.9}
        />
      </div>
      <div className="elytro-text-bold-body">Preparing & calculating</div>
      <div className="elytro-text-tiny-body text-gray-600">
        This may take up to 15 seconds
      </div>
    </div>
  );
};

export default PackingTip;
