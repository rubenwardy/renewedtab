import { BackgroundConfig, BackgroundMode, BackgroundModeType, getDescriptionForMode, getSchemaForMode } from "app/hooks/background";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Radio, RadioGroup } from "react-radio-group";
import { Form } from "../forms";


export interface BackgroundSettingsProps {
	background: BackgroundConfig | null;
	setBackground: (conf: BackgroundConfig) => void;
}

export default function BackgroundSettings(props: BackgroundSettingsProps) {
	if (!props.background) {
		return (<div className="modal-body">Loading...</div>);
	}

	const radioModes =
		Object.keys(BackgroundMode)
			.filter(value => isNaN(Number(value)))
			.map(x => (
				<div className="field" key={x}>
					<Radio value={x} />
					{x}:&nbsp;
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

	return (
		<div className="modal-body">
			<h3>
				<FormattedMessage
						defaultMessage="Background Type" />
			</h3>
			<RadioGroup name="mode" selectedValue={modeName} onChange={handleModeChanged}>
				{radioModes}
			</RadioGroup>
			<h3 className="mt-4">
				<FormattedMessage
						defaultMessage="{mode} Options"
						values={{mode: modeName}} />
			</h3>
			<Form
					values={props.background.values}
					schema={getSchemaForMode(props.background.mode)}
					onChange={handleSetValue} />
		</div>);
}
