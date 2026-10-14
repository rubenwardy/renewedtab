import { createContext, useContext } from "react";
import { cacheStorage } from "../storage";


export const WEBSITE_ICON_FALLBACK = "fa-globe-europe";


export const WebsiteIconsEnabledContext = createContext(false);


export function useWebsiteIconsEnabled(): boolean {
	return useContext(WebsiteIconsEnabledContext);
}


function getWebsiteIconOrNull(url: (string | undefined)): (string | undefined) {
	if (url == "" || url == undefined || !config.WEBSITE_ICONS_URL) {
		return undefined;
	}

	try {
		const domain = new URL(url).hostname;
		if (domain == "") {
			return undefined;
		}

		return new URL(encodeURIComponent(domain), config.WEBSITE_ICONS_URL).toString();
	} catch {
		return undefined;
	}
}


export function useWebsiteIconURL(url: (string | undefined)): (string | undefined) {
	const enabled = useWebsiteIconsEnabled();
	return enabled ? getWebsiteIconOrNull(url) : undefined;
}


export async function clearLegacyWebsiteIconCache() {
	const keys = await cacheStorage.keys();
	await Promise.all(keys
		.filter(key => key.startsWith("favicon-"))
		.map(key => cacheStorage.remove(key)));
}
