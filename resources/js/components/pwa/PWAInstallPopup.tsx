import React from 'react';
import { X, Download, Smartphone, Wifi, Zap, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '@/utils/image-helper';

interface PWAInstallPopupProps {
  isVisible: boolean;
  onInstall: () => void;
  onClose: () => void;
  storeName: string;
  storeIcon?: string;
  themeColors?: {
    primary: string;
    background: string;
  };
}

export default function PWAInstallPopup({ 
  isVisible, 
  onInstall, 
  onClose, 
  storeName,
  storeIcon,
  themeColors
}: PWAInstallPopupProps) {
  const { t } = useTranslation();
  
  if (!isVisible) return null;

  const primaryColor = themeColors?.primary || '#3B82F6';
  const backgroundColor = themeColors?.background || '#ffffff';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="flex items-center gap-4">
            {storeIcon ? (
              <img src={getImageUrl(storeIcon)} alt={storeName} className="w-16 h-16 rounded-xl object-contain border-2 border-gray-100 bg-white p-1" />
            ) : (
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center border-2 border-gray-100"
                style={{ backgroundColor: primaryColor }}
              >
                <Smartphone className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl mb-1">
                {storeName}
              </h3>
              <p className="text-gray-500 text-sm">
                {t('Add to home screen')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            {t('Install this app on your device for quick access and a better experience. It works offline and loads faster.')}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-50 flex items-center justify-center">
                <Wifi className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">{t('Works Offline')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-50 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">{t('Lightning Fast')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-50 flex items-center justify-center">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">{t('Easy Access')}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t('Maybe Later')}
          </button>
          <button
            onClick={onInstall}
            className="flex-1 py-3 px-4 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: `0 4px 14px 0 ${primaryColor}40`
            }}
          >
            <Download className="w-4 h-4" />
            {t('Install Now')}
          </button>
        </div>
      </div>
    </div>
  );
}