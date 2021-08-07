import { WidgetManager } from "app/WidgetManager";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import Carousel from "../Carousel";
import Modal from "../Modal";
import OnboardingHelp from "./OnboardingHelp";
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
	onClose: () => void;

	locale: string;
	setLocale: (locale: string) => void;
	manager: WidgetManager;
}

export interface OnboardingPageProps {
	onDone: () => void;

	locale: string;
	setLocale: (locale: string) => void;
	manager: WidgetManager;
}


export default function Onboarding(props: OnboardingProps) {
	const intl = useIntl();

	function applyGridPreset() {
		props.manager.createFromArray(presets[1].widgets);
		props.onClose();
	}

	const pageProps = {
		...props,
		onDone: props.onClose,
	};

	return (
		<Modal title={intl.formatMessage(messages.title)} {...props}
				onClose={undefined}>
			<Carousel>
				<OnboardingWelcome {...pageProps} />
				<OnboardingHelp />
				<OnboardingPresets {...pageProps} />
			</Carousel>
		</Modal>);
}
