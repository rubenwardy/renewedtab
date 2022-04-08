import { miscMessages } from "app/locale/common";
import { WidgetManager } from "app/WidgetManager";
import React from "react";
import { useIntl } from "react-intl";
import Carousel from "../Carousel";
import Modal from "../Modal";
import OnboardingHelp from "./OnboardingHelp";
import OnboardingPresets, { presets } from "./OnboardingPresets";
import OnboardingWelcome from "./OnboardingWelcome";

interface OnboardingProps {
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

	// TODO: decide whether it should be possible to skip onboarding
	// eslint-disable-next-line  @typescript-eslint/no-unused-vars
	function applyGridPreset() {
		props.manager.createFromArray(presets[1].widgets);
		props.onClose();
	}

	const pageProps = {
		...props,
		onDone: props.onClose,
	};

	return (
		<Modal title={intl.formatMessage(miscMessages.welcome,  { a: (chunk: any) => chunk })}
				{...props} wide={true} onClose={undefined} lighterBg={true}>
			<Carousel>
				<OnboardingWelcome {...pageProps} />
				<OnboardingHelp />
				<OnboardingPresets {...pageProps} />
			</Carousel>
		</Modal>);
}
