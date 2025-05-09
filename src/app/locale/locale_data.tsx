import { MessageFormatElement } from "react-intl";

type Translation = Record<string, MessageFormatElement[]>;

const locales : { [key: string]: Translation } = {
	"en": require("./compiled/en.json"),
	"be": require("./compiled/be.json"),
	"bg": require("./compiled/bg.json"),
	"de": require("./compiled/de.json"),
	"es": require("./compiled/es.json"),
	"fr": require("./compiled/fr.json"),
	"it": require("./compiled/it.json"),
	"ja": require("./compiled/ja.json"),
	"lt": require("./compiled/lt.json"),
	"ms": require("./compiled/ms.json"),
	"nl": require("./compiled/nl.json"),
	"pt-br": require("./compiled/pt_BR.json"),
	"ru": require("./compiled/ru.json"),
	"sv": require("./compiled/sv.json"),
	"tr": require("./compiled/tr.json"),
	"zh-cn": require("./compiled/zh_CN.json"),
	"zh-tw": require("./compiled/zh_TW.json"),
};


// Set fallbacks
for (const lang in locales) {
	if (lang != "en") {
		for (const [key, value] of Object.entries(locales["en"])) {
			if (typeof locales[lang][key] === "undefined" && key != "languageName") {
				locales[lang][key] = value;
			}
		}
	}
}


export default locales
