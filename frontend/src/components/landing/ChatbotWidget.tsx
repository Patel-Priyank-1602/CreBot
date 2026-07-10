import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

export default function ChatbotWidget() {
  const lenis = useLenis();

  // 1. Script Injection Effect — deferred to avoid blocking initial paint
  useEffect(() => {
    if (document.getElementById('crebot-widget-script')) {
      return;
    }

    const injectScript = () => {
      const script = document.createElement('script');
      script.id = 'crebot-widget-script';
      script.src = "https://crebot-ole4.onrender.com/widget/crebot-widget.js?v=3";
      script.setAttribute('data-bot-id', "85060bce-2d50-46cf-aba2-2595c6603fa3");
      script.setAttribute('data-api-url', "https://crebot-ole4.onrender.com");
      script.defer = true;
      document.body.appendChild(script);
    };

    // Use requestIdleCallback if available, otherwise fallback to 3s delay
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(injectScript, { timeout: 5000 });
    } else {
      setTimeout(injectScript, 3000);
    }
  }, []);

  // 2. Lenis Scroll Freeze Effect
  useEffect(() => {
    let classObserver: MutationObserver | null = null;

    const freezeBackground = () => {
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    };

    const unfreezeBackground = () => {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };

    const applyScrollFix = () => {
      const messagesContainer = document.getElementById('crebot-messages');
      const panelContainer = document.getElementById('crebot-panel');
      
      if (messagesContainer) {
        messagesContainer.setAttribute('data-lenis-prevent', 'true');
        messagesContainer.style.overscrollBehavior = 'contain';
      }
      
      if (panelContainer && !classObserver) {
        panelContainer.setAttribute('data-lenis-prevent', 'true');
        
        classObserver = new MutationObserver(() => {
          if (panelContainer.classList.contains('open')) {
            freezeBackground();
          } else {
            unfreezeBackground();
          }
        });
        
        classObserver.observe(panelContainer, { attributes: true, attributeFilter: ['class'] });

        // If it's already open (e.g. hot reload), freeze it now
        if (panelContainer.classList.contains('open')) {
          freezeBackground();
        }
        
        return true;
      }
      return false;
    };

    // Try immediately
    if (!applyScrollFix()) {
      // If not in DOM yet, observe until it is
      const domObserver = new MutationObserver(() => {
        if (applyScrollFix()) {
          domObserver.disconnect();
        }
      });
      domObserver.observe(document.body, { childList: true, subtree: true });
      
      return () => {
        domObserver.disconnect();
        if (classObserver) classObserver.disconnect();
        unfreezeBackground();
      };
    }

    return () => {
      if (classObserver) classObserver.disconnect();
      unfreezeBackground();
    };
  }, [lenis]);

  return null;
}
