import { WidgetManager } from "app/WidgetManager";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import Carousel from "../Carousel";
import Modal from "../Modal";
import OnboardingPresets, { presets } from "./OnboardingPresets";
import OnboardingWelcome from "./OnboardingWelcome";


const messages = defineMessages({
	title: {
		defaultMessage: "Welcome to Renewed Tab",
		description: "Onboarding modal: title",
	},
});

interface OnboardingProps {
	isOpen: boolean;
	manager: WidgetManager;
	onClose: () => void;
}

export interface OnboardingPageProps {
	manager: WidgetManager;
	onDone: () => void;
}


export default function Onboarding(props: OnboardingProps) {
	const intl = useIntl();

	function applyGridPreset() {
		props.manager.createFromArray(presets[1].widgets);
		props.onClose();
	}

	return (
		<Modal title={intl.formatMessage(messages.title)} {...props}
				onClose={applyGridPreset}>
			<Carousel>
				<OnboardingWelcome />
				<OnboardingPresets onDone={props.onClose} manager={props.manager} />
			</Carousel>
		</Modal>);
}
