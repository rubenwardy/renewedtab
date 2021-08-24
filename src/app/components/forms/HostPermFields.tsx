import { useCache, useForceUpdate, usePromise } from "app/hooks";
import { clearWebsiteIcons } from "app/WebsiteIcon";
import React, { ChangeEvent, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { FieldProps } from ".";
import RequestHostPermission from "../RequestHostPermission";
import RequestPermission from "../RequestPermission";


const messages = defineMessages({
	grantAll: {
		defaultMessage: "Grant permission to access all websites",
	},

	suggestURL: {
		defaultMessage: "Suggest URL be added to default suggestions",
		description: "Host URL field: button for users to suggest new URLs for RSS/Atom feeds"
	},

	suggestHelpText: {
		defaultMessage: "This will automatically send the URL to the Renewed Tab developers. They may then choose to add it to the suggestions for all users.",
		description: "Host URL field: help text for suggest URL button"
	},
});


export function HostURLFIeld(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value);
	const [submittedUrls, setSubmittedUrls] = useCache<{ [key: string]: boolean}>("submittedUrls", {});

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.checkValidity()) {
			return;
		}

		if (props.onChange) {
			props.onChange(e.target.value);
		}
		setValue(e.target.value);
	}

	let host = "";
	try {
		host = new URL(value).host;
	} catch (e) {
		// ignore
	}

	const intl = useIntl();
	const [autocomplete, ] = props.schemaEntry.autocomplete
			? usePromise(() => props.schemaEntry.autocomplete!(intl), [])
			: [ null, null ];

	const showSubmitURL = false;

	/* autocomplete && value && value.length > 4 &&
		submittedUrls && submittedUrls[value] != true &&
		!value.startsWith("file://") &&
		!autocomplete.some(suggestion => value == suggestion.value); */

	function submitURLToSuggestions() {
		const url = new URL(config.API_URL);
		url.pathname = (url.pathname + "autocomplete/").replace(/\/\//g, "/");

		fetch(new Request(url.toString(), {
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

	return (
		<>
			<input type="url" name={props.name} defaultValue={props.value}
					autoComplete={autocomplete ? "off" : "on"}
					onChange={handleChange} list={autocomplete ? `dl-${props.name}` : undefined} />

			{autocomplete &&
				<datalist id={`dl-${props.name}`}>
					{autocomplete.map(v => (
						<option key={v.value} value={v.value}>{v.label}</option>))}
				</datalist>}

			<RequestHostPermission host={host} />

			{showSubmitURL &&
				<p className="mt-2">
					<a onClick={submitURLToSuggestions}>
						<FormattedMessage {...messages.suggestURL} />
					</a>
					<i className="fas fa-question-circle ml-2"
						title={intl.formatMessage(messages.suggestHelpText)}></i>
				</p>}
		</>);
}


export function HostAllField(props: FieldProps<boolean>) {
	const [value, setValue] = useState(props.value);
	const forceUpdate = useForceUpdate();
	const intl = useIntl();

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			setValue(e.target.checked);
			props.onChange(e.target.checked);
		}
	}

	function onResult() {
		clearWebsiteIcons();
		forceUpdate();
	}

	const permissions: browser.permissions.Permissions = {
		permissions: [],
		origins: ["*://*/"],
	};

	const [needsPermission,] =
		usePromise(async () => ! await browser.permissions.contains(permissions),
				[forceUpdate]);

	return (
		<>
			<input type="checkbox" checked={value ?? false} onChange={handleChange} />
			<label className="inline ml-2" htmlFor={props.name}>
				{intl.formatMessage(props.schemaEntry.label)}
			</label>

			{needsPermission && value && (
				<p className="mt-2">
					<RequestPermission permissions={permissions}
						label={intl.formatMessage(messages.grantAll)}
						onResult={onResult} />
				</p>)}
		</>);
}

HostAllField.noParentLabel = true;
