import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { ChatGptModal } from '@/components/chatgpt';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';

export function FloatingChatGpt() {
  const { auth } = usePage().props as any;
  const [isOpen, setIsOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  
  // Check if user can access ChatGPT
  const userRole = auth?.roles?.[0] || auth?.user?.type;
  const isSuperAdmin = userRole === 'superadmin' || auth?.user?.type === 'superadmin';
  const isCompany = auth?.user?.type === 'company';
  
  let canUseChatGPT = false;
  
  if (isSuperAdmin) {
    canUseChatGPT = true;
  } else if (isCompany) {
    // For company users, check their own plan
    const hasActivePlan = auth?.user?.plan_is_active === 1 && auth?.user?.plan;
    canUseChatGPT = hasActivePlan && auth?.user?.plan?.enable_chatgpt === 'on';
  } else {
    // For other users, check the plan of the company user who created them
    const creator = auth?.user?.creator;
    const hasActivePlan = creator?.plan_is_active === 1 && creator?.plan;
    canUseChatGPT = hasActivePlan && creator?.plan?.enable_chatgpt === 'on';
  }
  
  // Don't render if user doesn't have access
  if (!canUseChatGPT) {
    return null;
  }
  
  useEffect(() => {
  }, [isOpen]);

  const handleGenerate = (content: string) => {
    setGeneratedContent(content);
    // You can add additional logic here if needed
  };

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div 
        className="fixed bottom-6 right-6 z-[9999]"
        onClickCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          handleModalOpen();
        }}
        onMouseDownCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleModalOpen();
          }}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="lg"
        >
          <Brain className="h-6 w-6" />
        </Button>
      </div>

      <ChatGptModal
        isOpen={isOpen}
        onClose={handleModalClose}
        onGenerate={handleGenerate}
        title="AI Assistant"
        placeholder="What would you like me to help you generate?"
      />
    </>
  );
}