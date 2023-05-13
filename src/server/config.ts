import fs from "fs";

export const PORT = process.env.PORT ?? 8000;
export const serverConfig = (function() {
	if (!fs.existsSync("config.json")) {
		return {};
	}
	return JSON.parse(fs.readFileSync("config.json").toString());
})();

export const IS_DEBUG = process.env.NODE_ENV !== "production";
export const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK ?? serverConfig.DISCORD_WEBHOOK;
export const UA_DEFAULT = "Mozilla/5.0 (compatible; Renewed Tab App/1.17.1; +https://renewedtab.com/)";
export const UA_PROXY = "Mozilla/5.0 (compatible; Renewed Tab Proxy/1.17.1; +https://renewedtab.com/)";
export const SENTRY_DSN = process.env.SENTRY_DSN;
export const SAVE_ROOT = process.env.SAVE_ROOT ?? serverConfig.SAVE_ROOT ?? ".";
export const ACCUWEATHER_API_KEY =
	process.env.ACCUWEATHER_API_KEY ?? serverConfig.ACCUWEATHER_API_KEY;
export const UNSPLASH_ACCESS_KEY =
	process.env.UNSPLASH_ACCESS_KEY ?? serverConfig.UNSPLASH_ACCESS_KEY;
