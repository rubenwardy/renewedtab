import { MessageFormatElement } from "react-intl";

type Translation = Record<string, MessageFormatElement[]>;

const locales : { [key: string]: Translation } = {
	"en": require("./compiled/en.json"),
	"tr": require("./compiled/tr.json"),
};

for (const lang in locales) {
	if (lang != "en") {
		for (const [key, value] of Object.entries(locales["en"])) {
			if (typeof locales[lang][key] === "undefined") {
				locales[lang][key] = value;
			}
		}
	}
}

export default function getTranslation(locale: string): Translation {
	return locales[locale] ?? locales.en;
}

export function getUserLocale(): string {
	const langs = navigator.languages ? navigator.languages : [navigator.language];
	for (const lang of langs) {
		if (locales[lang]) {
			return lang;
		}
	}

	for (const lang of langs) {
		const idx = lang.indexOf("-");
		if (idx && locales[lang.substring(0, idx)]) {
			return lang;
		}
	}

	return "en";
}
