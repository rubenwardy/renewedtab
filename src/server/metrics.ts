import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
export const promRegister = client.register;
collectDefaultMetrics();


const requestsCounter = new client.Counter({
	name: 'renewedtab_requests',
	help: 'renewedtab_requests',
	labelNames: [ "endpoint" ],
});

export function notifyAPIRequest(endpoint: string) {
	requestsCounter.labels({ endpoint }).inc();
}


const upstreamCounter = new client.Counter({
	name: 'renewedtab_upstream_requests',
	help: 'renewedtab_upstream_requests',
	labelNames: [ "upstream" ],
});

export function notifyUpstreamRequest(upstream: string) {
	upstreamCounter.labels({ upstream }).inc();
}
