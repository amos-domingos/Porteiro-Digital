
/**
 * Nexus Native Bridge
 * Gerencia comunicação com wrappers nativos (Capacitor/Cordova)
 */

export const NativeBridge = {
  isNative: () => {
    return (window as any).Capacitor !== undefined;
  },

  wakeDevice: async () => {
    console.log("Nexus: Solicitando ativação da tela...");
    
    // 1. Tenta API Web padrão (Wake Lock)
    if ('wakeLock' in navigator) {
      try { 
        await (navigator as any).wakeLock.request('screen');
        console.log("Nexus: WakeLock web ativado.");
      } catch (e) {
        console.warn("Nexus: WakeLock web falhou.", e);
      }
    }

    // 2. Se for nativo, tenta chamar plugins específicos
    if (NativeBridge.isNative()) {
      try {
        const { Device, Insomnia } = (window as any).Capacitor.Plugins;
        if (Insomnia) await Insomnia.keepAwake();
        // No Android nativo, isso exigiria um plugin customizado para call FLAG_TURN_SCREEN_ON
      } catch (e) {
        console.error("Nexus: Erro em comando nativo Insomnia:", e);
      }
    }
  },

  sendCriticalAlert: (title: string, body: string) => {
    // Alerta sonoro imediato
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => console.warn("Auto-play de áudio bloqueado."));

    if (Notification.permission === 'granted') {
      // FIX: Cast to any as 'renotify' property is supported by browsers but might be missing in standard lib.dom.d.ts NotificationOptions
      new Notification(title, { 
        body, 
        icon: 'https://cdn-icons-png.flaticon.com/512/9374/9374944.png',
        tag: 'nexus-critical',
        renotify: true
      } as any);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
};
