import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChatGptButton } from './ChatGptButton';
import { ChatGptModal } from './ChatGptModal';
import { useState } from 'react';

interface ChatGptFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'input' | 'textarea';
  rows?: number;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  modalTitle?: string;
  modalPlaceholder?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export function ChatGptField({
  value,
  onChange,
  placeholder,
  type = 'input',
  rows = 3,
  className = '',
  required = false,
  disabled = false,
  modalTitle = 'AI Content Generator',
  modalPlaceholder = 'Describe what you want to generate...',
  buttonText = 'Auto Generate',
  buttonVariant = 'outline'
}: ChatGptFieldProps) {
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = (content: string) => {
    onChange(content);
    setShowModal(false);
  };

  const InputComponent = type === 'textarea' ? Textarea : Input;

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        <InputComponent
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          required={required}
          disabled={disabled}
          rows={type === 'textarea' ? rows : undefined}
        />
        <ChatGptButton
          onClick={() => setShowModal(true)}
          text={buttonText}
          variant={buttonVariant}
          className="shrink-0"
        />
      </div>
      
      <ChatGptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGenerate={handleGenerate}
        title={modalTitle}
        placeholder={modalPlaceholder}
      />
    </>
  );
}