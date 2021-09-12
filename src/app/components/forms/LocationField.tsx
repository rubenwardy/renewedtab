import { useAPI } from "app/hooks";
import React, { useRef, useState, KeyboardEvent } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { FieldProps } from ".";
import ErrorView from "../ErrorView";
import { Location } from "common/api/weather";
import Modal from "../Modal";
import { miscMessages } from "app/locale/common";
import Button, { ButtonVariant } from "../Button";


const messages = defineMessages({
	modalTitle: {
		defaultMessage: "Choose Location",
		description: "Location field",
	},

	search: {
		defaultMessage: "Search",
		description: "Location form field: search",
	},

	noLocationsFound: {
		defaultMessage: "No locations found",
		description: "Location form field: error",
	},
});


function LocationQuery(props: { query: string, onSelect: (loc: Location) => void }) {
	const [info, error] = useAPI<Location[]>("geocode/", { q: props.query }, [props.query]);
	if (!info) {
		return (<ErrorView error={error} loading={true} panel={false} />);
	}

	if (info.length == 0) {
		return (
			<p className="text-muted">
				<FormattedMessage {...messages.noLocationsFound} />
			</p>);
	}

	const items = info.map(location => (
		<li key={location.name}>
			<a onClick={() => props.onSelect(location)}>{location.name}</a>
		</li>));

	return (<ul className="links large">{items}</ul>);
}


function LocationLookup(props: { query: Location, onSelect: (loc: Location) => void }) {
	const [info, error] = useAPI<Location[]>("geolookup/",
		{ lat: props.query.latitude, long: props.query.longitude }, [props.query]);
	if (!info) {
		return (<ErrorView error={error} loading={true} panel={false} />);
	}

	if (info.length == 0) {
		return (
			<p className="text-muted">
				<FormattedMessage {...messages.noLocationsFound} />
			</p>);
	}

	const items = info.map(location => (
		<li key={location.name}>
			<a onClick={() => props.onSelect(location)}>{location.name}</a>
		</li>));

	return (<ul className="links large">{items}</ul>);
}


function getGeoLocation(): Promise<GeolocationPosition> {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}


interface LocationModalProps {
	accept: (location: Location) => void;
	cancel: () => void;
}


function LocationModal(props: LocationModalProps) {
	const ref = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState<string | Location>("");

	function handleSearch() {
		if (!ref.current) {
			return;
		}

		const value = ref.current.value;
		if (value.length > 0) {
			setQuery(value);
		}
	}

	function onKeyPress(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key == "Enter") {
			handleSearch();
		}
	}

	function handleSelect(location: Location) {
		if (typeof query == "string") {
			location.name = query;
		}
		props.accept(location);
	}

	async function doGeoLocation() {
		const position = await getGeoLocation();

		setQuery({
			name: "",
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		})
	}

	const intl = useIntl();
	return (
		<Modal title={intl.formatMessage(messages.modalTitle)}
				onClose={props.cancel} lighterBg={true}>
			<div className="modal-body">
				<div className="field-group mt-1">
					<input type="text" ref={ref} autoFocus={true}
						onKeyPress={onKeyPress} />
					<Button variant={ButtonVariant.Secondary} icon="icon_location.svg"
						onClick={() => doGeoLocation().catch(e => alert(e.message))}/>
					<Button onClick={handleSearch} label={messages.search} />
				</div>
				{query == "" && (
					<p className="text-muted mt-2">
						<FormattedMessage
							defaultMessage="Try including the country name or initials." />
					</p>)}
				{typeof query == "object" &&
					<LocationLookup query={query} onSelect={handleSelect} />}
				{typeof query == "string" && query != "" &&
					<LocationQuery query={query} onSelect={handleSelect} />}
				<p className="text-muted mt-4">
					<FormattedMessage
						defaultMessage="Powered by <a>OpenStreetMap</a>."
						values={{
							a: (chunk: any) => (<a href="https://www.openstreetmap.org/">{chunk}</a>)
						}} />
				</p>
				<Button variant={ButtonVariant.Secondary} onClick={props.cancel}
					label={miscMessages.cancel} />
			</div>
		</Modal>);
}


export default function LocationField(props: FieldProps<Location>) {
	const [isModalOpen, setModalOpen] = useState(false);
	const [value, setValue] = useState<Location>(props.value);

	function handleSelect(location: Location) {
		props.onChange(location);
		setModalOpen(false);
		setValue(location);
	}


	let info: any;
	if (value) {
		info = (
			<FormattedMessage
				defaultMessage="<b>{name}</b> at {latitude} by {longitude}"
				values={{
					b: (chunk: any) => (<strong className="text-normal">{chunk}</strong>),
					name: value.name,
					latitude: value.latitude.toFixed(4),
					longitude: value.longitude.toFixed(4), }} />);
	} else {
		info = (
			<FormattedMessage
				defaultMessage="Please select a location"
				description="Location form field: prompt" />);
	}

	return (
		<>
			<div className="field-group">
				<div className="fake-input">
					<div className="vertical-middle">
						<div className="text-muted">{info}</div>
					</div>
				</div>
				<Button onClick={() => setModalOpen(true)} label={miscMessages.edit} />
			</div>

			{isModalOpen &&
				<LocationModal
					accept={handleSelect}
					cancel={() => setModalOpen(false)} />}
		</>);
}
