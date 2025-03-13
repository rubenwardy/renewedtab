import { backgroundProviders, getBackgroundProvider, getSchemaForProvider } from "app/features/backgrounds/providers";
import { BackgroundConfig } from "app/hooks/background";
import { miscMessages } from "app/locale/common";
import { myFormatMessage, MyFormattedMessage } from "app/locale/MyMessageDescriptor";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Form } from "app/components/forms";
import Radio, { RadioGroup } from "app/components/Radio";


export interface BackgroundSettingsProps {
	background: BackgroundConfig | null;
	setBackground: (conf: BackgroundConfig) => void;
}

export default function BackgroundSettings(props: BackgroundSettingsProps) {
	const intl = useIntl();

	if (!props.background) {
		return (<>Loading...</>);
	}

	const isBrowser = typeof browser !== "undefined";

	const radioModes =
		Object.entries(backgroundProviders)
			.map(([key, provider]) => {
				const isDisabled = !isBrowser && provider.isBrowserOnly;

				return (
					<div key={key}>
						<Radio value={key} disabled={isDisabled} />
						<MyFormattedMessage message={provider.title} />{": "}
						<span className="text-muted">
							<MyFormattedMessage
								message={isDisabled ? miscMessages.requiresBrowserVersion : provider.description} />
						</span>
					</div>);
			});

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
		<>
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
			{selectedProvider.formHint &&
					<p className="text-muted">
						<MyFormattedMessage message={selectedProvider.formHint} />
					</p>}
			<Form
					values={props.background.values}
					schema={getSchemaForProvider(selectedProvider.id)}
					onChange={handleSetValue} />
		</>);
}
