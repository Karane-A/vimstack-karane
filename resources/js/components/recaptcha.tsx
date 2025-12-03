import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';

interface RecaptchaProps {
  onVerify: (token: string) => void;
  onExpired?: () => void;
  onError?: () => void;
}

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaReady: () => void;
    recaptchaExecute: () => Promise<string>;
  }
}

let globalWidgetId: number | null = null;
let isVerified = false;
let currentSettings: any = {};

export default function Recaptcha({ onVerify, onExpired, onError }: RecaptchaProps) {
  const { settings = {} } = usePage().props as any;
  const recaptchaRef = useRef<HTMLDivElement>(null);

  const recaptchaEnabled = settings.recaptchaEnabled === 'true' || settings.recaptchaEnabled === true || settings.recaptchaEnabled === 1 || settings.recaptchaEnabled === '1';
  const recaptchaVersion = settings.recaptchaVersion || 'v2';
  const recaptchaSiteKey = settings.recaptchaSiteKey || '';

  currentSettings = { recaptchaEnabled, recaptchaVersion, recaptchaSiteKey };

  const executeV3 = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(recaptchaSiteKey, { action: 'submit' })
            .then((token: string) => {
              isVerified = true;
              onVerify(token);
              resolve(token);
            })
            .catch((error: any) => {
              isVerified = false;
              if (onError) onError();
              reject(error);
            });
        });
      } else {
        reject(new Error('reCAPTCHA not loaded'));
      }
    });
  };

  // Global execute function for forms to use
  window.recaptchaExecute = () => {
    if (currentSettings.recaptchaVersion === 'v3') {
      return executeV3();
    }
    return Promise.resolve(window.grecaptcha?.getResponse(globalWidgetId) || '');
  };

  useEffect(() => {
    if (!recaptchaEnabled || !recaptchaSiteKey) return;

    const renderV2 = () => {
      if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current && globalWidgetId === null) {
        globalWidgetId = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: recaptchaSiteKey,
          callback: (token: string) => {
            isVerified = true;
            onVerify(token);
          },
          'expired-callback': () => {
            isVerified = false;
            if (onExpired) onExpired();
          },
          'error-callback': () => {
            isVerified = false;
            if (onError) onError();
          },
        });
      }
    };

    const renderV3 = () => {
      executeV3().catch(() => {});
    };

    if (window.grecaptcha) {
      if (recaptchaVersion === 'v2') {
        renderV2();
      } else {
        renderV3();
      }
    } else {
      window.onRecaptchaReady = () => {
        if (recaptchaVersion === 'v2') {
          renderV2();
        } else {
          renderV3();
        }
      };
      const script = document.createElement('script');
      script.src = recaptchaVersion === 'v3' 
        ? `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
        : 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaReady&render=explicit';
      document.head.appendChild(script);
    }

    return () => {
      if (globalWidgetId !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(globalWidgetId);
        } catch (e) {}
        globalWidgetId = null;
      }
      isVerified = false;
    };
  }, []);

  if (!recaptchaEnabled || !recaptchaSiteKey) {
    return null;
  }

  return recaptchaVersion === 'v2' ? <div ref={recaptchaRef}></div> : null;
}

export const isRecaptchaVerified = () => isVerified;
export const getRecaptchaResponse = () => {
  if (globalWidgetId !== null && window.grecaptcha) {
    return window.grecaptcha.getResponse(globalWidgetId);
  }
  return isVerified ? 'verified' : '';
};
export const executeRecaptcha = () => {
  return window.recaptchaExecute ? window.recaptchaExecute() : Promise.resolve('');
};