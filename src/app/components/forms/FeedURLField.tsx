import { buildAPIURL, fetchCheckCors, useCache, usePromise } from "app/hooks";
import { parseURL } from "app/utils";
import { AutocompleteItem } from "app/utils/Schema";
import React, { useRef, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { FieldProps } from ".";
import RequestHostPermission from "../RequestHostPermission";


const messages = defineMessages({
	suggestURL: {
		defaultMessage: "Suggest URL be added to default suggestions",
		description: "Host URL field: button for users to suggest new URLs for RSS/JSONFeed/Atom feeds"
	},

	suggestHelpText: {
		defaultMessage: "This will automatically send the URL to the Renewed Tab developers. They may then choose to add it to the suggestions for all users.",
		description: "Host URL field: help text for suggest URL button"
	},
});


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function URLSubmitter(props: { url: string, autocomplete?: AutocompleteItem[] }) {
	const value = props.url;
	const intl = useIntl();
	const [submittedUrls, setSubmittedUrls] = useCache<{ [key: string]: boolean}>("submittedUrls", {});
	const showSubmitURL = props.autocomplete && value && value.length > 4 &&
		submittedUrls && submittedUrls[value] != true &&
		!value.startsWith("file://") &&
		!props.autocomplete.some(suggestion => value == suggestion.value);

	function submitURLToSuggestions() {
		const url = buildAPIURL("/autocomplete/");
		fetchCheckCors(new Request(url.toString(), {
			method: "POST",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				url: value,
			}),
		})).catch(console.error);

		setSubmittedUrls({
			[value]: true,
			...submittedUrls
		});
	}

	return showSubmitURL ?
		(<p className="mt-4">
			<a onClick={submitURLToSuggestions}>
				<FormattedMessage {...messages.suggestURL} />
			</a>
			<i className="fas fa-question-circle ml-2"
				title={intl.formatMessage(messages.suggestHelpText)}></i>
		</p>) : <></>
}


export default function FeedURLField(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value);
	const ref = useRef<HTMLInputElement>(null);

	function handleBlurOrPermission() {
		if (!ref.current!.checkValidity()) {
			return;
		}

		props.onChange(value);
	}

	const host = parseURL(value)?.host ?? "";
	const intl = useIntl();
	const [autocomplete, ] =
		usePromise(() => props.schemaEntry.autocomplete?.(intl) ?? Promise.resolve(null), []);

	return (
		<>
			<input type="url" name={props.name} value={value} ref={ref}
					autoComplete={autocomplete ? "off" : "on"}
					onChange={e => setValue(e.target.value)}
					onBlur={handleBlurOrPermission}
					list={autocomplete ? `dl-${props.name}` : undefined} />

			{autocomplete &&
				<datalist id={`dl-${props.name}`}>
					{autocomplete.map(v => (
						<option key={v.value} value={v.value}>{v.label}</option>))}
				</datalist>}

			<RequestHostPermission host={host} onHasPermission={handleBlurOrPermission} />
			{/* <URLSubmitter url={value} autocomplete={autocomplete ?? undefined} /> */}
		</>);
}
