import { getAssetFromKV, serveStatic } from external: ['@cloudflare/kv-asset-handler'];

    addEventListener('fetch', event => {
        event.respondWith(handleEvent(event));
    });

    async function handleEvent(event: FetchEvent) {
        try {
            return await getAssetFromKV(event);
        } catch (e) {
            // If the asset is not found, try serving index.html for SPAs
            if (e.name === 'NotFoundError') {
                return await getAssetFromKV(event, {
                    mapRequestToAsset: req => serveStatic(req, {
                        path: 'index.html' // Serve index.html for all unfound paths
                    }),
                });
            }
            return new Response('Error serving asset', { status: 500 });
        }
    }
