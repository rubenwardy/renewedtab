import { defineMessage, MessageDescriptor, MessageFormatElement } from "react-intl";

type Translation = Record<string, MessageFormatElement[]>;


const locales : { [key: string]: Translation } = {
	"en": require("./compiled/en.json"),
	"ms": require("./compiled/ms.json"),
	"pt": require("./compiled/pt.json"),
	"pt-br": require("./compiled/pt_BR.json"),
	"tr": require("./compiled/tr.json"),
};


const languageName = defineMessage({
	defaultMessage: "English",
	description: "The name of the current language, to be used in the settings dialog"
}) as MessageDescriptor;


// Set fallbacks
for (const lang in locales) {
	if (lang != "en") {
		for (const [key, value] of Object.entries(locales["en"])) {
			if (typeof locales[lang][key] === "undefined" && key != languageName.id!) {
				locales[lang][key] = value;
			}
		}
	}
}


/**
 * Get list of supported languages, to be used in the settings dialog
 *
 * @returns Dictionary of language locale to textual name
 */
export function getLanguages() {
	const ret: { [key: string]: string } = {};
	for (const key in locales) {
		const text = locales[key][languageName.id!] as any;
		if (text) {
			ret[key] = `${text[0].value} (${key})`;
		} else {
			ret[key] = key;
		}
	}
	return ret;
}


/**
 * Get translation, or fallback to English
 *
 * @param locale ISO locale string
 * @returns React-Intl translation
 */
export function getTranslation(locale: string): Translation {
	return locales[locale] ?? locales.en;
}


/**
 * Detects the user's language, based on their browser/system settings
 *
 * @returns Locale string, to be used with getTranslation
 */
export function getUserLocale(): string {
	const langs = navigator.languages ? navigator.languages : [navigator.language];

	// Find exact matches, eg: es-mx
	for (const lang of langs) {
		if (locales[lang.toLowerCase()]) {
			return lang;
		}
	}

	// Find matches to canonical language, eg: es-mx -> es
	for (const lang of langs) {
		const idx = lang.indexOf("-");
		if (idx && locales[lang.substring(0, idx).toLowerCase()]) {
			return lang;
		}
	}

	return "en";
}
