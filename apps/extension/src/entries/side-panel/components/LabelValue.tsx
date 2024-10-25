const LabelValue = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-row justify-between items-center gap-x-2 text-sm ">
    <span className="text-gray-500 whitespace-nowrap">{label}:</span>
    <span className="text-gray-900 font-medium break-all">{value}</span>
  </div>
);

export default LabelValue;
