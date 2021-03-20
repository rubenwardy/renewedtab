function getDomain(url: string): string {
	return new URL(url).hostname;
}


async function fetchIcon(url: string): Promise<string> {
	const response = await fetch(new Request(url, {
		method: "GET",
		headers: {
			"Accept": "text/html",
		},
	}));

	const html = new window.DOMParser().parseFromString(
		await response.text(), "text/html");

	const icons = html.querySelectorAll("link[rel='icon']");

	let topScore = -1;
	let topIcon : (Element | null) = null;
	for (let icon of icons.values()) {
		const sizes = icon.getAttribute("sizes")?.split("x") ?? [];
		const score = sizes.map((x) => parseInt(x))
			.reduce((acc, x) => acc + x, 0);
		if (score > topScore) {
			topScore = score;
			topIcon = icon;
		}
	}

	const ret = new URL(url);
	ret.pathname = topIcon?.getAttribute("href") ?? "/favicon.ico";
	return ret.toString();
}


const cache = new Map<string, Promise<string>>();

export function getWebsiteIcon(url: string): Promise<string> {
	const key = getDomain(url);
	if (!cache.has(key)) {
		cache.set(key, fetchIcon(url));
	}

	return cache.get(key)!;
}
