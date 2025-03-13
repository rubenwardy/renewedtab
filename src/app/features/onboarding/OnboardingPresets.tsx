import { fromTypedJSON } from "app/utils/TypedJSON";
import React from "react";
import { defineMessage, FormattedMessage, MessageDescriptor } from "react-intl";
import { OnboardingPageProps } from ".";
import { ButtonVariant } from "app/components/Button";
import ImportButton from "app/components/ImportButton";
import { useWidgetManager } from "app/hooks/widgetManagerContext";


interface Preset {
	id: string;
	title: MessageDescriptor;
	description: MessageDescriptor;
	preview: string;
	widgets: any[];
}

interface PresetProps extends Preset {
	onClick: () => void;
}

function Preset(props: PresetProps) {
	return (
		<li>
			<a onClick={props.onClick} data-cy={`preset-${props.id}`}>
				<div className="preset-preview">
					<img src={props.preview} />
				</div>
				<div className="preset-title">
					<FormattedMessage {...props.title} />
				</div>
				<div className="preset-description">
					<FormattedMessage {...props.description} />
				</div>
			</a>
		</li>
	);
}


export const presets: Preset[] = [
	{
		id: "focus",
		title: defineMessage({
			defaultMessage: "Focus",
			description: "Preset: focus",
		}),
		description: defineMessage({
			defaultMessage: "Just a clock and a search bar",
			description: "Preset: focus description",
		}),
		preview: "onboarding_preset_focus.png",
		widgets: fromTypedJSON(require("./presets/focus.json")).widgets,
	},
	{
		id: "grid",
		title: defineMessage({
			defaultMessage: "Grid",
			description: "Preset: Grid",
		}),
		description: defineMessage({
			defaultMessage: "The news, weather, and more",
			description: "Preset: grid description",
		}),
		preview: "onboarding_preset_grid.png",
		widgets: fromTypedJSON(require("./presets/grid.json")).widgets,
	},
	{
		id: "goals",
		title: defineMessage({
			defaultMessage: "Goals",
			description: "Preset: goals",
		}),
		description: defineMessage({
			defaultMessage: "Daily goals and inspirational quotes",
			description: "Preset: focus description",
		}),
		preview: "onboarding_preset_goals.png",
		widgets: fromTypedJSON(require("./presets/goals.json")).widgets,
	},
];


export const gridPreset = presets[1];


export default function OnboardingPresets(props: OnboardingPageProps) {
	const widgetManager = useWidgetManager();

	function applyPreset(preset: Preset) {
		widgetManager.createFromArray(preset.widgets);
		props.onDone();
	}

	return (
		<div className="modal-body onboarding">
			<h3>
				<FormattedMessage
					defaultMessage="Choose a Starting Point"
					description="Onboarding: presets title" />
			</h3>
			<ul className="presets">
				{presets.map(preset => (
					<Preset key={preset.id} {...preset}
						onClick={() => applyPreset(preset)} />))}
			</ul>
			<p className="text-muted mt-4">
				<FormattedMessage
					defaultMessage="You can add (<add></add>) or remove (<remove></remove>) widgets later, or change settings (<cog></cog>) as desired."
					description="Onboarding: preset hint"
					values={{
						add: () => <i className="fas fa-plus" />,
						remove: () => <i className="fas fa-trash" />,
						cog: () => <i className="fas fa-cog" />,
					}} />
			</p>
			<p className="text-muted">
				<FormattedMessage
					defaultMessage="Alternatively: <import></import>"
					values={{
						import: () =>
							<ImportButton small={true} variant={ButtonVariant.Secondary} />,
					}} />
			</p>
		</div>);
}
