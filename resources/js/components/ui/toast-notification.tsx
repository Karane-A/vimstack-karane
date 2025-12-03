import React from 'react';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  description?: string;
  duration?: number;
}

export function showToast(
  message: string,
  type: ToastType = 'info',
  options: ToastOptions = {}
) {
  const { description, duration = 5000 } = options;
  
  const Icon = type === 'success' 
    ? CheckCircle 
    : type === 'error' 
      ? XCircle 
      : AlertCircle;
  
  const bgColor = type === 'success' 
    ? 'bg-green-50 dark:bg-green-900/20' 
    : type === 'error' 
      ? 'bg-red-50 dark:bg-red-900/20' 
      : 'bg-blue-50 dark:bg-blue-900/20';
  
  const iconColor = type === 'success' 
    ? 'text-green-500 dark:text-green-400' 
    : type === 'error' 
      ? 'text-red-500 dark:text-red-400' 
      : 'text-blue-500 dark:text-blue-400';
  
  toast(
    <div className="flex items-start">
      <div className={`p-1 rounded-full ${bgColor} mr-3`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{message}</h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
    </div>,
    {
      duration,
    }
  );
}