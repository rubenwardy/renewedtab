import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;
export const promRegister = client.register;
collectDefaultMetrics();

new client.Gauge({
	name: "nodejs_uptime",
	help: "uptime in seconds",
	collect() {
	  this.set(process.uptime());
	},
  });


const requestsCounter = new client.Counter({
	name: "renewedtab_requests",
	help: "renewedtab_requests",
	labelNames: [ "endpoint" ],
});

export function notifyAPIRequest(endpoint: string) {
	requestsCounter.labels({ endpoint }).inc();
}


const upstreamCounter = new client.Counter({
	name: "renewedtab_upstream_requests",
	help: "renewedtab_upstream_requests",
	labelNames: [ "upstream" ],
});

export function notifyUpstreamRequest(upstream: string) {
	upstreamCounter.labels({ upstream }).inc();
}


const upstreamRetriesCounter = new client.Counter({
	name: "renewedtab_upstream_retries",
	help: "renewedtab_upstream_retries",
	labelNames: [ "upstream" ],
});


export function notifyUpstreamRetry(upstream: string) {
	upstreamRetriesCounter.labels({ upstream }).inc();
}
