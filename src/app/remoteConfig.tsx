import { fetchAPI } from "app/hooks/http";
import { RemoteConfig } from "common/api/remoteConfig";


const defaultRemoteConfig: RemoteConfig = {
	analytics_consent_rollout_percent: 0,
};

let remoteConfig: Promise<RemoteConfig> | undefined;


async function fetchRemoteConfig(): Promise<RemoteConfig> {
	try {
		const config = await fetchAPI<Partial<RemoteConfig>>("config/", {});
		return { ...defaultRemoteConfig, ...config };
	} catch (e) {
		console.error(e);
		return defaultRemoteConfig;
	}
}


export function getRemoteConfig(): Promise<RemoteConfig> {
	if (!remoteConfig) {
		remoteConfig = fetchRemoteConfig();
	}
	return remoteConfig;
}
