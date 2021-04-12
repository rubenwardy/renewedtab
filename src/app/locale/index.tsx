import { MessageFormatElement } from "react-intl";

const locales : { [key: string]: Record<string, MessageFormatElement[]> } = {
	"en": require("app/locale/compiled/en.json"),
};

for (let lang in locales) {
	if (lang != "en") {
		for (let [key, value] of Object.entries(locales["en"])) {
			if (typeof locales[lang][key] === "undefined") {
				locales[lang][key] = value;
			}
		}
	}
}

export default function getTranslation(locale: string) {
	return locales[locale] ?? locales.en;
}

export function getUserLocale() {
	const langs = navigator.languages ? navigator.languages : [navigator.language];
	for (let lang of langs) {
		if (locales[lang]) {
			return lang;
		}
	}

	for (let lang of langs) {
		const idx = lang.indexOf("-");
		if (idx && locales[lang.substring(0, idx)]) {
			return lang;
		}
	}

	return "en";
}
