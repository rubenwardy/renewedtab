import { fromTypedJSON } from "app/utils/TypedJSON";
import React from "react";
import { defineMessage, FormattedMessage, MessageDescriptor } from "react-intl";
import { OnboardingPageProps } from ".";


interface Preset {
	label: MessageDescriptor;
	preview: string;
	widgets: any[];
}

interface PresetProps extends Preset {
	onClick: () => void;
}

function Preset(props: PresetProps) {
	return (
		<li>
			<a onClick={props.onClick}>
				<div className="preset-preview">
					<img src={props.preview} />
				</div>
				<div className="preset-title">
					<FormattedMessage {...props.label} />
				</div>
			</a>
		</li>
	);
}


const presets: Preset[] = [
	{
		label: defineMessage({
			defaultMessage: "Focus",
			description: "Preset: focus",
		}),
		preview: "onboarding_preset_focus.png",
		widgets: fromTypedJSON(require("./presets/focus.json")).widgets,
	},
	{
		label: defineMessage({
			defaultMessage: "Grid",
			description: "Preset: Grid",
		}),
		preview: "onboarding_preset_grid.png",
		widgets: fromTypedJSON(require("./presets/grid.json")).widgets,
	},
];


export default function OnboardingPresets(props: OnboardingPageProps) {
	function applyPreset(preset: Preset) {
		preset.widgets.forEach(widgetData => {
			const widget = props.manager.createWidget(widgetData.type);
			widget.position = widgetData.position ?? undefined;
			widget.size = widgetData.size ?? widget.size;
			widget.props = widgetData.props
				? { ...widgetData.props } : widget.props;
			widget.theme = widgetData.theme
				? { ...widgetData.theme } : widget.theme;
		});
		props.onDone();
	}

	return (
		<div className="modal-body onboarding">
			<h3>
				<FormattedMessage
					defaultMessage="Choose a Preset"
					description="Onboarding: presets title" />
			</h3>
			<ul className="presets">
				{presets.map(preset => (
					<Preset key={(preset.label as any).id} {...preset}
						onClick={() => applyPreset(preset)} />))}
			</ul>
			<p className="text-muted mt-4">
				<FormattedMessage
					defaultMessage="Presets only change the widgets you start with."
					description="Onboarding: preset hint" />

				&nbsp;

				<FormattedMessage
					defaultMessage="You can add (<add></add>) or remove (<remove></remove>) widgets afterwards, or change settings (<cog></cog>) as desired."
					description="Onboarding: preset hint"
					values={{
						add: () => <i className="fas fa-plus" />,
						remove: () => <i className="fas fa-trash" />,
						cog: () => <i className="fas fa-cog" />,
					}} />
			</p>
		</div>);
}
