import { usePromise, useStorage } from "app/hooks";
import { getFeedbackURLFromInfo, getInstallInfo } from "app/utils/webext";
import React from "react";
import { Alert, AlertButton } from "./Alert";

function ReviewRequesterImpl(props: { onDone: () => void }) {
	const [installInfo] = usePromise(getInstallInfo, []);
	const storeURL = installInfo?.storeURL;
	const feedbackURL = installInfo && getFeedbackURLFromInfo(installInfo, "feedback");

	const reviewButtons: AlertButton[] = [
		{ text: "Review", url: storeURL ?? undefined },
		{ text: "Help", url: "https://renewedtab.rubenwardy.com/help/" },
		{ text: "Feedback", url: feedbackURL ?? undefined },
		{ text: "Dismiss", icon: "fa-times" },
	];

	return (
		<Alert
			message="Are you enjoying Renewed Tab? Give us a review!"
			buttons={reviewButtons} onButtonClick={props.onDone} />);
}


interface ReviewRequestInfo {
	dismissed: boolean;
	installDate?: Date;
}


export default function ReviewRequester() {
	const [reviewRequestInfo, setReviewRequestInfo] = useStorage<ReviewRequestInfo>("review_request", {
		dismissed: false
	}, false);

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
