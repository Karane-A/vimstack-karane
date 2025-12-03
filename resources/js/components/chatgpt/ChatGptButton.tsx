import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatGptButtonProps {
  onClick: () => void;
  text?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function ChatGptButton({ 
  onClick, 
  text = "Auto Generate",
  variant = "outline",
  size = "sm",
  className = ""
}: ChatGptButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <Brain className="h-4 w-4" />
      {t(text)}
    </Button>
  );
}