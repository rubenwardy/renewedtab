import { useAPI } from "app/hooks";
import { Location } from "app/utils/Schema";
import React, { useRef, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { FieldProps } from ".";
import ErrorView from "../ErrorView";

const messages = defineMessages({
	loading: {
		defaultMessage: "Loading results...",
	},

	selected: {
		defaultMessage: "Selected {name} at {latitude} by {longitude}.",
	},
})

export function LocationQuery(props: { query: string, onSelect: (loc: Location) => void }) {
	const [info, error] = useAPI<Location[]>("geocode/", { q: props.query }, [props.query]);
	if (!info) {
		return (<ErrorView error={error} loading={true} panel={false} />);
	}

	if (info.length == 0) {
		return (
			<p className="text-muted">
				<FormattedMessage
						defaultMessage="No locations found" />
			</p>);

	}

	const items = info.map(location => (
		<li key={location.name}>
			<a onClick={() => props.onSelect(location)}>{location.name}</a>
		</li>));

	return (<ul className="links">{items}</ul>);
}

export default function LocationField(props: FieldProps<Location>) {
	const ref = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState<string | null>(null);
	const [value, setValue] = useState<Location>(props.value ?? {});

	function handleSearch() {
		if (!ref.current) {
			return;
		}

		const value = ref.current.value;
		if (value.length > 5) {
			setQuery(value);
		}
	}

	function handleSelect(location: Location) {
		if (props.onChange) {
			location.name = query ?? location.name;
			props.onChange(location);
			setQuery(null);
			setValue(location);
		}
	}

	let location_after : JSX.Element | undefined;
	if (query) {
		location_after = (<LocationQuery query={query} onSelect={handleSelect} />);
	} else if (props.value) {
		location_after = (
			<p>
				<FormattedMessage {...messages.selected} values={{
						name: value.name,
						latitude: value.latitude,
						longitude: value.longitude,
					}} />
			</p>);
	} else {
		location_after = (
			<p className="text-muted">
				<FormattedMessage
						defaultMessage="Please select a location" />
			</p>);
	}

	return (
		<>
			<div className="field-group">
				<input type="text" ref={ref} name={props.name} defaultValue={value.name} />
				<a className="btn btn-primary" onClick={handleSearch}>
					<FormattedMessage
							defaultMessage="Search" />
				</a>
			</div>
			{location_after}
			<p className="text-muted">
				<FormattedMessage
					defaultMessage="Powered by <a>OpenStreetMap</a>."
					values={{
						a: (chunk: any) => (<a href="https://www.openstreetmap.org/">{chunk}</a>)
					}} />
			</p>
		</>);
}
