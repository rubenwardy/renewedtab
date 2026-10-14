const technicalData: browser.permissions.Permissions = {
	data_collection: ["technicalAndInteraction"],
};

const isFirefoxExtension = typeof browser !== "undefined" && app_version.target == "firefox";
let isTechnicalDataAllowed = !isFirefoxExtension;


async function checkTechnicalDataAllowed(): Promise<void> {
	try {
		const permissions = await browser.permissions.getAll();
		isTechnicalDataAllowed = permissions.data_collection === undefined ||
			permissions.data_collection.includes("technicalAndInteraction");
	} catch (e) {
		console.error(e);
		isTechnicalDataAllowed = true;
	}
}


export const technicalDataChecked: Promise<void> =
	isFirefoxExtension ? checkTechnicalDataAllowed() : Promise.resolve();


export function getIsTechnicalDataAllowed(): boolean {
	return isTechnicalDataAllowed;
}


/**
 * Asks Firefox for permission to send technical data, if needed. Firefox only
 * shows a prompt if it isn't already granted.
 *
 * Must be called directly from a user input handler, before any await.
 */
export async function requestTechnicalData(): Promise<boolean> {
	if (!isFirefoxExtension) {
		return true;
	}

	try {
		isTechnicalDataAllowed = await browser.permissions.request(technicalData);
	} catch (e) {
		console.error(e);
		await checkTechnicalDataAllowed();
	}

	return isTechnicalDataAllowed;
}


const revokedCallbacks: (() => void)[] = [];

/**
 * Calls `callback` when the user turns off technical data in about:addons.
 */
export function onTechnicalDataRevoked(callback: () => void): void {
	revokedCallbacks.push(callback);
}


function isTechnicalDataPermission(permissions: browser.permissions.Permissions) {
	return permissions.data_collection?.includes("technicalAndInteraction") ?? false;
}


if (isFirefoxExtension) {
	browser.permissions.onRemoved.addListener(permissions => {
		if (isTechnicalDataPermission(permissions)) {
			isTechnicalDataAllowed = false;
			revokedCallbacks.forEach(callback => callback());
		}
	});

	browser.permissions.onAdded.addListener(permissions => {
		if (isTechnicalDataPermission(permissions)) {
			isTechnicalDataAllowed = true;
		}
	});
}
