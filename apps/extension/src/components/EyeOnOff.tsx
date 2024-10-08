import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface EyeOnOffProps extends React.SVGProps<SVGSVGElement> {
  defaultIsOn?: boolean;
  onChangeVisible?: (isOn: boolean) => void;
}

export function EyeOnOff({
  defaultIsOn = false,
  onChangeVisible,
  ...rest
}: EyeOnOffProps) {
  const [isOn, setIsOn] = useState(defaultIsOn);

  const handleChanged = (val: boolean) => {
    setIsOn(val);
    onChangeVisible?.(val);
  };

  return isOn ? (
    <Eye onClick={() => handleChanged(false)} {...rest} />
  ) : (
    <EyeOff onClick={() => handleChanged(true)} {...rest} />
  );
}
