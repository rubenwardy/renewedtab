interface Config {
	API_URL: string;
	PROXY_URL: string;
	SENTRY_DSN?: string;
}

declare let config: Config;
declare const is_debug: boolean;
declare const app_version: string;
