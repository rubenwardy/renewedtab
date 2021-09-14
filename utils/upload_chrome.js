// Copyright (c) 2020 Andrew Levine
// License: MIT
// From https://github.com/fregante/chrome-webstore-upload

const fs = require("fs");
const process = require("process");
const { default: fetch, Request } = require("node-fetch");

const rootURI = "https://www.googleapis.com";
const refreshTokenURI = "https://www.googleapis.com/oauth2/v4/token";
const uploadExistingURI = id => `${rootURI}/upload/chromewebstore/v1.1/items/${id}`;
const publishURI = (id, target) => (
	`${rootURI}/chromewebstore/v1.1/items/${id}/publish?publishTarget=${target}`
);

const requiredFields = [
	"extensionId",
	"clientId",
	"refreshToken"
];

class APIClient {
	constructor(options) {
		requiredFields.forEach(field => {
			if (!options[field]) {
				throw new Error(`Option "${field}" is required`);
			}

			this[field] = options[field];
		});

		if ("clientSecret" in options) {
			this.clientSecret = options.clientSecret;
		}
	}

	async uploadExisting(readStream, token = this.fetchToken()) {
		if (!readStream) {
			throw new Error("Read stream missing");
		}

		const { extensionId } = this;

		const response = await fetch(new Request(uploadExistingURI(extensionId), {
			method: "PUT",
			headers: this._headers(await token),
			body: readStream,
		}));

		if (!response.ok) {
			throw new Error(await response.text());
		}

		return await response.json();
	}

	async publish(target = "default", token = this.fetchToken()) {
		const { extensionId } = this;

		const response = await fetch(new Request(publishURI(extensionId, target), {
			method: "POST",
			headers: this._headers(await token),
		}));

		return await response.json();
	}

	async fetchToken() {
		const { clientId, clientSecret, refreshToken } = this;

		const response = await fetch(new Request(refreshTokenURI, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: refreshToken,
				grant_type: "refresh_token",
			}),
		}));

		const json = await response.json();
		return json.access_token;
	}

	_headers(token) {
		return {
			Authorization: `Bearer ${token}`,
			"x-goog-api-version": "2"
		};
	}
}


async function upload(zipPath) {
	const webstore = new APIClient({
		extensionId: process.env.CHROME_EXTENSION_ID,
		clientId: process.env.CHROME_CLIENT_ID,
		clientSecret: process.env.CHROME_CLIENT_SECRET,
		refreshToken: process.env.CHROME_REFRESH_TOKEN,
	});

	console.log("Getting token");
	const token = webstore.fetchToken();
	const myZipFile = fs.readFileSync(zipPath);
	console.log("Uploading to Chrome Web Store...")
	const res = await webstore.uploadExisting(myZipFile, token);
	console.log(res);
}

if (process.argv.length < 3) {
	console.log("USAGE: node ./utils/upload_chrome.js path/to/chrome.zip");
	process.exit(1);
}

if (!fs.existsSync(process.argv[2])) {
	console.log(`${process.argv[2]} does not exist`);
	process.exit(1);
}

if (!process.argv[2].endsWith("chrome.zip")) {
	console.log(`${process.argv[2]} does not end in chrome.zip`);
	process.exit(1);
}

upload(process.argv[2]).catch(console.error);
