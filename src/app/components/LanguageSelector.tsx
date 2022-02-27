import { usePromise } from "app/hooks/promises";
import { getLanguages } from "app/locale";
import { mergeClasses } from "app/utils";
import React, { ChangeEvent, useMemo } from "react";
import { FormattedMessage } from "react-intl";


interface LanguageSelectorProps {
	locale: string;
	setLocale: (locale: string) => void;

	className?: string;
}


export default function LanguageSelector(props: LanguageSelectorProps) {
	function onLocaleChange(e: ChangeEvent<HTMLSelectElement>) {
		const selectedIndex = e.target.options.selectedIndex;
		const locale = e.target.options[selectedIndex].getAttribute("value");
		if (locale) {
			props.setLocale(locale);
		}
	}

	const langs = useMemo(() => Object.entries(getLanguages()).sort(
		([,x], [,y]) => x.localeCompare(y, undefined, { sensitivity: "base" })), []);

	return (
		<div className={mergeClasses("field", props.className)}>
			<label htmlFor="locale">
				<i className="fas fa-language mr-2" />
				<FormattedMessage defaultMessage="Language" />
			</label>
			<select value={props.locale} onChange={onLocaleChange}>
				{langs.map(([key, title]) =>
					<option key={key} value={key}>{title}</option>)}
			</select>
			<p className="text-muted">
				<FormattedMessage
					defaultMessage="Translations are provided by the community."
					values={{
						a: (chunk: any) => (
							<a href="https://renewedtab.com/translations/">{chunk}</a>)
					}} />
				{props.locale == "en" ? <br /> : " "}
				<FormattedMessage
					defaultMessage="Consider <a>contributing or adding your language</a>."
					values={{
						a: (chunk: any) => (
							<a href="https://renewedtab.com/translations/">{chunk}</a>)
					}} />
			</p>
		</div>);
}
