export interface InstallInfo {
	platform?: string;
	browser?: string;
	browserVersion?: string;
	storeURL?: string;
	extensionVersion: string;
}


function getReviewURL(browserName: string): string {
	if (browserName.toLowerCase() == "chrome") {
		return "https://chrome.google.com/webstore/detail/renewed-tab/laljofodhebajcajogbolahbjdcnfgkf";
	} else {
		return "https://addons.mozilla.org/addon/renewed-tab/";
	}
}


export async function getInstallInfo(): Promise<InstallInfo> {
	const ret: InstallInfo = { extensionVersion: app_version.version };

	try {
		const platform = await browser.runtime.getPlatformInfo();
		ret.platform = platform.os;
	} catch (e) {
		console.error(e);
	}

	try {
		if (typeof browser.runtime.getBrowserInfo !== "undefined") {
			const browserInfo = await browser.runtime.getBrowserInfo()
			ret.browser = browserInfo.name;
			ret.browserVersion = browserInfo.version;
		} else {
			ret.browser = "Chrome";
		}

		ret.storeURL = getReviewURL(ret.browser);
	} catch (e) {
		console.error(e);
	}


	return ret;
}


export function getFeedbackURLFromInfo(info: InstallInfo, path: string): string {
	const url = new URL(path, "https://renewedtab.com/");

	if (info.platform) {
		url.searchParams.set("platform", info.platform);
	}

	if (info.browser) {
		if (info.browserVersion) {
			url.searchParams.set("browser", `${info.browser} ${info.browserVersion}`);
		} else {
			url.searchParams.set("browser", info.browser);
		}
	}

	url.searchParams.set("version", app_version.version);

	return url.toString();
}


export async function getFeedbackURL(path: string): Promise<string> {
	return getFeedbackURLFromInfo(await getInstallInfo(), path);
}
