/**
 * Checks that translations contain the same variables
 */

const fs = require('fs');

function readJSON(path) {
	return JSON.parse(fs.readFileSync(path).toString());
}

const english = readJSON("src/app/locale/locales/en.json");

const dir = fs.opendirSync("src/app/locale/locales");

let hasError = false;

let item;
while ((item = dir.readSync()) !== null) {
	if (item.name.endsWith(".json") && item.name != "en.json") {
		const path = "src/app/locale/locales/" + item.name;

		const current = readJSON(path);

		const rVariable = /(\{[a-z]+\}|\<[a-z]+\>)/g;
		Object.entries(english).forEach(([key, value]) => {
			const translated = current[key];
			if (!translated) {
				return;
			}

			[...value.message.matchAll(rVariable)].forEach(match => {
				if (!translated.message.includes(match[0])) {
					console.error(`${path}: translation ${key} missing ${match[0]} variable`);
					hasError = true;
				}
			});
		})
	}
}

dir.closeSync();

process.exit(hasError ? 1 : 0);
