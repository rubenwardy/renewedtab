import { backgroundProviders, getBackgroundProvider, getSchemaForProvider } from "app/backgrounds";
import { BackgroundConfig } from "app/hooks/background";
import { myFormatMessage, MyFormattedMessage } from "app/locale/MyMessageDescriptor";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Radio, RadioGroup } from "react-radio-group";
import { Form } from "../forms";


export interface BackgroundSettingsProps {
	background: BackgroundConfig | null;
	setBackground: (conf: BackgroundConfig) => void;
}

export default function BackgroundSettings(props: BackgroundSettingsProps) {
	const intl = useIntl();

	if (!props.background) {
		return (<div className="modal-body">Loading...</div>);
	}

	const radioModes =
		Object.entries(backgroundProviders)
			.map(([key, provider]) => (
				<div key={key}>
					<Radio value={key} />
					<MyFormattedMessage message={provider.title} />:&nbsp;
					<span className="text-muted">
						<MyFormattedMessage message={provider.description} />
					</span>
				</div>));

	function handleModeChanged(newMode: string) {
		props.background!.mode = newMode;
		props.setBackground(props.background!);
	}

	function handleSetValue(key: string, val: any) {
		props.background!.values[key] = val;
		props.setBackground(props.background!);
	}


	const selectedProvider = getBackgroundProvider(props.background.mode)!;
	const translatedTitle = myFormatMessage(intl, selectedProvider.title);
	return (
		<div className="modal-body">
			<label htmlFor="mode">
				<FormattedMessage
						defaultMessage="Background Type" />
			</label>
			<RadioGroup name="mode" selectedValue={props.background.mode}
					onChange={handleModeChanged} className="radios field">
				{radioModes}
			</RadioGroup>
			<h3 className="mt-4">
				<FormattedMessage
						defaultMessage="{mode} Options"
						values={{mode: translatedTitle}}
						description="Background mode options" />
			</h3>
			<Form
					values={props.background.values}
					schema={getSchemaForProvider(selectedProvider.id)}
					onChange={handleSetValue} />
		</div>);
}
