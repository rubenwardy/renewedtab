import { BackgroundConfig, BackgroundMode, BackgroundModeType, getTitleForMode, getDescriptionForMode, getSchemaForMode } from "app/hooks/background";
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
		Object.keys(BackgroundMode)
			.filter(value => isNaN(Number(value)))
			.map(x => (
				<div key={x}>
					<Radio value={x} />
					<FormattedMessage
							{...getTitleForMode(BackgroundMode[x as BackgroundModeType])} />:&nbsp;
					<span className="text-muted">
						<FormattedMessage
								{...getDescriptionForMode(BackgroundMode[x as BackgroundModeType])} />
					</span>
				</div>));

	function handleModeChanged(newMode: string) {
		props.background!.mode = BackgroundMode[newMode as BackgroundModeType];
		props.setBackground(props.background!);
	}

	function handleSetValue(key: string, val: any) {
		props.background!.values[key] = val;
		props.setBackground(props.background!);
	}

	const modeName = BackgroundMode[props.background.mode];
	const translatedTitle = intl.formatMessage(getTitleForMode(props.background.mode));

	return (
		<div className="modal-body">
			<label htmlFor="mode">
				<FormattedMessage
						defaultMessage="Background Type" />
			</label>
			<RadioGroup name="mode" selectedValue={modeName}
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
					schema={getSchemaForMode(props.background.mode)}
					onChange={handleSetValue} />
		</div>);
}
