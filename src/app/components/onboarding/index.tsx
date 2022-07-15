import { miscMessages } from "app/locale/common";
import { WidgetManager } from "app/WidgetManager";
import React from "react";
import { useIntl } from "react-intl";
import Carousel from "../Carousel";
import Modal from "../Modal";
import OnboardingHelp from "./OnboardingHelp";
import OnboardingPresets from "./OnboardingPresets";
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
