interface Version {
	version: string;
	is_debug: boolean;
	commit: string;
	environment: string;
	target: ("firefox" | "chrome");
}


interface Config {
	API_URL: string;
	PROXY_URL: string;
	SENTRY_DSN?: string;
}

declare let config: Config;
declare const app_version: Version;
