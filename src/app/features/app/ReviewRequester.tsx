import { defineMessages } from "react-intl";
import { usePromise, useStorage } from "app/hooks";
import { miscMessages } from "app/locale/common";
import { getInstallInfo } from "app/utils/webext";
import React from "react";
import { useIntl } from "react-intl";
import { Alert, AlertButton } from "app/components/Alert";


const messages = defineMessages({
	review_request: {
		defaultMessage: "Are you enjoying Renewed Tab? Give us a review!",
	},

	review: {
		defaultMessage: "Review",
		description: "Review request, review button"
	},
})

function ReviewRequesterImpl(props: { onDone: () => void }) {
	const [installInfo] = usePromise(getInstallInfo, []);
	const storeURL = installInfo?.storeURL;
	const intl = useIntl();

	const reviewButtons: AlertButton[] = [
		{ text: intl.formatMessage(messages.review), url: storeURL ?? undefined },
		{ text: intl.formatMessage(miscMessages.help), url: "https://renewedtab.com/help/" },
		{ text: intl.formatMessage(miscMessages.dismiss), icon: "fa-times" },
	];

	return (
		<Alert
			message={intl.formatMessage(messages.review_request)}
			buttons={reviewButtons} onButtonClick={props.onDone} />);
}


interface ReviewRequestInfo {
	dismissed: boolean;
	installDate?: Date;
}


export default function ReviewRequester() {
	const [reviewRequestInfo, setReviewRequestInfo] = useStorage<ReviewRequestInfo>("review_request", {
		dismissed: false
	});

	if (!reviewRequestInfo || reviewRequestInfo.dismissed || typeof browser === "undefined") {
		return (<></>);
	}

	if (!reviewRequestInfo.installDate) {
		reviewRequestInfo.installDate = new Date();
		setReviewRequestInfo({ ...reviewRequestInfo! });
		return (<></>);
	}

	const showDate = new Date(reviewRequestInfo.installDate.valueOf() + 5*24*60*60*1000);
	if (new Date().valueOf() <= showDate.valueOf()) {
		console.log(`Will request review at ${showDate.toUTCString()}`);

		return (<></>);
	}

	function dismiss() {
		reviewRequestInfo!.dismissed = true;
		setReviewRequestInfo({ ...reviewRequestInfo! });
	}

	return (<ReviewRequesterImpl  onDone={dismiss} />);
}
