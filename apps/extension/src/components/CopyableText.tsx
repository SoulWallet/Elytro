import { safeClipboard } from '@/utils/clipboard';
import { cn } from '@/utils/shadcn/utils';
import { Copy } from 'lucide-react';
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
  return (
    <div className={cn('flex flex-row gap-2 items-center', className)}>
      <div>{text}</div>
      <Copy
        className="w-4 h-4 cursor-pointer"
        data-testid="copy_icon"
        onClick={() => safeClipboard(originalText || '')}
      />
    </div>
  );
}
