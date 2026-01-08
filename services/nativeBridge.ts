
/**
 * Nexus Native Bridge
 * Este serviço gerencia a comunicação com wrappers nativos (Capacitor/Cordova)
 * para funções que o navegador padrão não permite por segurança.
 */

export const NativeBridge = {
  // Verifica se está rodando como APK (via Capacitor)
  isNative: () => {
    return (window as any).Capacitor !== undefined;
  },

  // Tenta "acordar" o dispositivo via código nativo injetado
  wakeDevice: async () => {
    console.log("Nexus: Tentando acordar dispositivo...");
    
    if (NativeBridge.isNative()) {
      try {
        // Exemplo de chamada para um plugin customizado do Capacitor
        // await (window as any).Capacitor.Plugins.NexusNative.wakeScreen();
      } catch (e) {
        console.error("Erro ao chamar função nativa:", e);
      }
    } else {
      // Fallback para PWA: Usa WakeLock API para manter ligada se já estiver visível
      if ('wakeLock' in navigator) {
        try { await (navigator as any).wakeLock.request('screen'); } catch (e) {}
      }
    }
  },

  // Envia notificação crítica que aparece sobre outros apps
  // Fix: Removed 'sticky' property as it is not part of the standard NotificationOptions type.
  sendCriticalAlert: (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, silent: false });
    }
  }
};
