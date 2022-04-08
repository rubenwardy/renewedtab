const fs = require('fs');

const dir = fs.opendirSync("src/app/locale/locales");

const enabledLocales = JSON.parse(fs.readFileSync("src/app/locale/enabledLocales.json"));


let item;
while ((item = dir.readSync()) !== null) {
	const locale = item.name.replace(".json", "");
	if (enabledLocales[locale.toLowerCase().replace("_", "-")]) {
		console.log(locale);

		const { appName, appDescription } = JSON.parse(fs.readFileSync(`src/app/locale/locales/${item.name}`));
		const out = { appName, appDescription };
		fs.mkdirSync(`src/webext/_locales/${locale}/`, { recursive: true });
		fs.writeFileSync(`src/webext/_locales/${locale}/messages.json`, JSON.stringify(out, undefined, "\t"));
	}
}

dir.closeSync();
