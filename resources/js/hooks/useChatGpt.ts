import { useState } from 'react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

interface UseChatGptOptions {
  onSuccess?: (content: string) => void;
  onError?: (error: string) => void;
}

export function useChatGpt(options: UseChatGptOptions = {}) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const generateContent = async (prompt: string): Promise<string | null> => {
    if (!prompt.trim()) {
      toast.error(t('Please enter a prompt'));
      return null;
    }

    setIsLoading(true);
    try {
      const response = await fetch(route('chatgpt.generate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (response.ok) {
        options.onSuccess?.(data.content);
        return data.content;
      } else {
        const errorMessage = data.message || t('Failed to generate content');
        toast.error(errorMessage);
        options.onError?.(errorMessage);
        return null;
      }
    } catch (error) {
      const errorMessage = t('Error connecting to AI service');
      toast.error(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isModalOpen,
    isLoading,
    openModal,
    closeModal,
    generateContent
  };
}