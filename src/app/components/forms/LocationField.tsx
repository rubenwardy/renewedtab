import { useAPI } from "app/hooks";
import React, { useRef, useState, KeyboardEvent } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { FieldProps } from ".";
import ErrorView from "../ErrorView";
import { Location } from "common/api/weather";
import Modal from "../Modal";
import { miscMessages } from "app/locale/common";


const messages = defineMessages({
	modalTitle: {
		defaultMessage: "Choose Location",
		description: "Location field",
	},

	search: {
		defaultMessage: "Search",
		description: "Location form field: search",
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
				<FormattedMessage
						defaultMessage="No locations found"
						description="Location form field: error" />
			</p>);
	}

	const items = info.map(location => (
		<li key={location.name}>
			<a onClick={() => props.onSelect(location)}>{location.name}</a>
		</li>));

	return (<ul className="links large">{items}</ul>);
}


interface LocationModalProps {
	accept: (location: Location) => void;
	cancel: () => void;
}


function LocationModal(props: LocationModalProps) {
	const ref = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState<string>("");

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
		location.name = query;
		props.accept(location);
	}

	const intl = useIntl();
	return (
		<Modal title={intl.formatMessage(messages.modalTitle)}
				isOpen={true} onClose={props.cancel} lighterBg={true}>
			<div className="modal-body">
				<div className="field-group mt-1">
					<input type="text" ref={ref} autoFocus={true}
						onKeyPress={onKeyPress} />
					<a className="btn btn-primary" onClick={handleSearch}>
						<FormattedMessage {...messages.search} />
					</a>
				</div>
				<p className="text-muted">
					<FormattedMessage
						defaultMessage="Try including the country name or initials." />
				</p>
				{query != "" &&
					<LocationQuery query={query} onSelect={handleSelect} />}
				<p className="text-muted">
					<FormattedMessage
						defaultMessage="Powered by <a>OpenStreetMap</a>."
						values={{
							a: (chunk: any) => (<a href="https://www.openstreetmap.org/">{chunk}</a>)
						}} />
				</p>
				<a className="btn btn-secondary" onClick={props.cancel}>
					<FormattedMessage {...miscMessages.cancel} />
				</a>
			</div>
		</Modal>);
}


export default function LocationField(props: FieldProps<Location>) {
	const [isModalOpen, setModalOpen] = useState(false);
	const [value, setValue] = useState<Location>(props.value);

	function handleSelect(location: Location) {
		if (props.onChange) {
			props.onChange(location);
		}
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
					...value }} />);
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
				<a className="btn btn-primary" onClick={() => setModalOpen(true)}>
					<FormattedMessage {...miscMessages.edit} />
				</a>
			</div>

			{isModalOpen &&
				<LocationModal
					accept={handleSelect}
					cancel={() => setModalOpen(false)} />}
		</>);
}
