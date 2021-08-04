import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
export const promRegister = client.register;
collectDefaultMetrics();

const requestsCounter = new client.Counter({
	name: 'renewedtab_requests',
	help: 'renewedtab_requests',
	labelNames: [ "endpoint" ],
});


export function notifyAPICall(endpoint: string) {
	requestsCounter.labels({ endpoint }).inc();
}
