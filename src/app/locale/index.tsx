import { defineMessages, MessageDescriptor, MessageFormatElement } from "react-intl";

type Translation = Record<string, MessageFormatElement[]>;


const getLocales = async () => (await import(/* webpackChunkName: "locale" */ "./locale_data")).default;


const availableLocales: Record<string, string> = require("./enabledLocales.json")


// Locales will automatically resolve to more generic locales (ie: es-MX to es),
// but not the other way around.
const localeAliases: { [key: string]: string } = {
	"pt": "pt-br",
	"zh": "zh-cn",
	"zh-hant": "zh-tw",
	"zh-hans": "zh-cn",
};


defineMessages({
	appName: {
		id: "appName",
		defaultMessage: "Renewed Tab",
		description: "The name of the app",
	},
	lang: {
		id: "languageName",
		defaultMessage: "",
		description: "The name of the current language, to be used in the settings dialog",
	},
}) as MessageDescriptor;


/**
 * Get list of supported languages, to be used in the settings dialog
 *
 * @returns Dictionary of language locale to textual name
 */
export function getLanguages(): Record<string, string> {
	const ret: { [key: string]: string } = {};
	for (const [key, name] of Object.entries(availableLocales)) {
		ret[key] = `${name} (${key})`;
	}
	return ret;
}


/**
 * Get translation, or fallback to English
 *
 * @param locale ISO locale string
 * @returns React-Intl translation
 */
export async function getTranslation(locale: string): Promise<Translation | null> {
	if (locale == "en") {
		return {};
	} else {
		const locales = await getLocales();
		return locales[localeAliases[locale.toLowerCase()] ?? locale];
	}
}


/**
 * Detects the user's language, based on their browser/system settings
 *
 * @returns Locale string, to be used with getTranslation
 */
export function detectUserLocale(): string {
	const rawLangs = navigator.languages ? navigator.languages : [navigator.language];
	const langs = rawLangs.map(lang => lang.toLowerCase());

	for (const lang of langs) {
		// Find exact matches, eg: es-mx
		const langAliased = localeAliases[lang] ?? lang;
		if (availableLocales[langAliased]) {
			return langAliased;
		}

		// Find matches to higher-level/shorter language, eg: es-mx -> es
		const idx = lang.indexOf("-");
		const shortLang = lang.substring(0, idx);
		const shortLangAliased = localeAliases[shortLang] ?? shortLang;
		if (idx && availableLocales[shortLangAliased]) {
			return shortLangAliased;
		}
	}

	return "en";
}
