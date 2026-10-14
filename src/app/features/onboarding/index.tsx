import { miscMessages } from "app/locale/common";
import React from "react";
import { useIntl } from "react-intl";
import Carousel, { CarouselPage } from "app/components/Carousel";
import Modal from "app/components/Modal";
import { isPosthogEnabled } from "app/analytics/posthog";
import OnboardingAnalytics from "./OnboardingAnalytics";
import { AnalyticsConsentButtons } from "app/components/AnalyticsConsent";
import OnboardingHelp from "./OnboardingHelp";
import OnboardingPresets from "./OnboardingPresets";
import OnboardingWelcome from "./OnboardingWelcome";

interface OnboardingProps {
	onClose: () => void;

	locale: string;
	setLocale: (locale: string) => void;
}

export interface OnboardingPageProps {
	onDone: () => void;

	locale: string;
	setLocale: (locale: string) => void;
}


export default function Onboarding(props: OnboardingProps) {
	const intl = useIntl();

	const pageProps = {
		...props,
		onDone: props.onClose,
	};

	const pages: (CarouselPage | false)[] = [
		{ key: "welcome", content: <OnboardingWelcome {...pageProps} /> },
		isPosthogEnabled && {
			key: "analytics",
			content: <OnboardingAnalytics />,
			renderNext: next => <AnalyticsConsentButtons source="onboarding" onDone={next} />,
		},
		{ key: "help", content: <OnboardingHelp /> },
		{ key: "presets", content: <OnboardingPresets {...pageProps} /> },
	];

	return (
		<Modal title={intl.formatMessage(miscMessages.welcome,  { a: (chunk: any) => chunk })}
				{...props} wide={true} onClose={undefined} lighterBg={true}>
			<Carousel pages={pages.filter((page): page is CarouselPage => page !== false)} />
		</Modal>);
}
