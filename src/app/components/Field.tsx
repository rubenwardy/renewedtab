import { useAPI } from "app/utils/hooks";
import { Location, Type } from "app/utils/Schema";
import React, { ChangeEvent, useRef, useState } from "react";
import RequestHostPermission from "./RequestHostPermission";

interface FieldProps<T> {
	name: string;
	value: T;
	label?: string;
	hint?: string;
	onChange?: (value: T) => void;
}

export function TextField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	const hint = props.hint ? (<p className="text-muted">{props.hint}</p>) : null;
	return (
		<div className="field">
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<input type="text" name={props.name} defaultValue={props.value}
					onChange={handleChange} />
					{hint}
		</div>);
}

export function PermURLField(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
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

	const hint = props.hint ? (<p className="text-muted">{props.hint}</p>) : null;
	return (
		<div className="field">
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<input type="text" name={props.name} defaultValue={props.value}
					onChange={handleChange} />
			{hint}
			<RequestHostPermission host={host} />
		</div>);
}

export function DateField(props: FieldProps<Date>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			const ms = Date.parse(e.target.value);
			if (!Number.isNaN(ms)) {
				props.onChange(new Date(ms));
			}
		}
	}

	const hint = props.hint ? (<p className="text-muted">{props.hint}</p>) : null;
	return (
		<div className="field">
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<input type="date" name={props.name}
					defaultValue={props.value.toISOString().slice(0, 10)}
					onChange={handleChange} />
			{hint}
		</div>);
}

export function JSONField(props: FieldProps<Object | any[]>) {
	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		if (props.onChange) {
			props.onChange(JSON.parse(e.target.value));
		}
	}

	const hint = props.hint ? (<p className="text-muted">{props.hint}</p>) : null;
	return (
		<div className="field">
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<textarea name={props.name}
					defaultValue={JSON.stringify(props.value)}
					onChange={handleChange} />
			{hint}
		</div>);
}

export function LocationQuery(props: { query: string, onSelect: (loc: Location) => void }) {
	const [info, error] = useAPI<Location[]>("geocode/", { q: props.query }, [props.query]);
	if (!info) {
		return (
			<p className="text-muted">
				{error ? error.toString() : "Loading results..."}
			</p>);
	}

	if (info.length == 0) {
		return (
			<p className="text-muted">
				No locations found
			</p>);

	}

	const items = info.map(location => (
		<li key={location.name}>
			<a onClick={() => props.onSelect(location)}>{location.name}</a>
		</li>));

	return (<ul className="links">{items}</ul>);
}

export function LocationField(props: FieldProps<Location>) {
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
				Selected {value.name} at {value.latitude} by {value.longitude}.
			</p>);
	} else {
		location_after = (<p className="text-muted">Please select a location</p>);
	}


	return (
		<div className="field">
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<div className="field-group">
				<input type="text" ref={ref} name={props.name} defaultValue={value.name} />
				<a className="btn btn-primary" onClick={handleSearch}>Search</a>
			</div>
			{location_after}
			<p className="text-muted">
				Powered by <a href="https://www.openstreetmap.org/">OpenStreetMap</a>.
				{props.hint}
			</p>
		</div>);
}

export function makeField(type: Type): React.FC<FieldProps<any>> {
	if (type == Date) {
		return DateField;
	} else if (type == "object") {
		return JSONField;
	} else if (type == "perm_url") {
		return PermURLField;
	} else if (type == "location") {
		return LocationField;
	} else {
		return TextField;
	}
}
