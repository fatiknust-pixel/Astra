// Service worker mínimo: permite instalar o app; tudo vem da rede (dados sempre atualizados).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
