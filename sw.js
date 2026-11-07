const CACHE_NAME = 'capital-tech-saas-v1.0';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './gestor.html',
    './manifest.json'
];

// 1. INSTALAÇÃO: Faz o download do sistema para o celular do técnico
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Capital Tech: Cache de arquivos offline criado.');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 2. ATIVAÇÃO: Apaga o cache velho (da época da G3) para garantir que rodem a versão nova
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Capital Tech: Limpando versão antiga do sistema...');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. ESTRATÉGIA DE REDE: Tenta buscar a versão mais recente na internet (Network First). 
// Se falhar (técnico no subsolo sem 4G), puxa o aplicativo da memória do celular.
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});