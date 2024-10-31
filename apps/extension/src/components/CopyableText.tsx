import { safeClipboard } from '@/utils/clipboard';
import { cn } from '@/utils/shadcn/utils';
import { Copy } from 'lucide-react';
import { MouseEventHandler } from 'react';
interface ICopyableTextProps {
  text: React.ReactNode;
  originalText: Nullable<string>;
  className?: string;
}

export default function CopyableText({
  text,
  originalText,
  className,
}: ICopyableTextProps) {
  const handleClick: MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    safeClipboard(originalText || '');
  };
  return (
    <div className={cn('flex flex-row gap-2 items-center', className)}>
      <div>{text}</div>
      <Copy className="w-4 h-4 cursor-pointer" onClick={handleClick} />
    </div>
  );
}
