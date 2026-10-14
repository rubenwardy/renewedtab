import { mergeClasses } from "app/utils";
import React, { ReactNode } from "react";
import { useState } from "react";
import { defineMessages } from "react-intl";
import Button, { ButtonVariant } from "./Button";


const messages = defineMessages({
	next: {
		defaultMessage: "Next",
		description: "Onboarding page: next button"
	},

	previous: {
		defaultMessage: "Previous",
		description: "Onboarding page: previous button"
	},
});


export interface CarouselPage {
	key: string;
	content: ReactNode;
	renderNext?: (next: () => void) => ReactNode;
}


interface CarouselProps {
	pages: CarouselPage[];
}


export default function Carousel(props: CarouselProps) {
	const [page, setPage] = useState(0);
	function prevPage() {
		setPage(Math.max(0, page - 1));
	}
	function nextPage() {
		if (page < props.pages.length - 1) {
			setPage(page + 1);
		}
	}

	const current = props.pages[page];
	return (
		<>
			<React.Fragment key={current.key}>{current.content}</React.Fragment>
			<div className="modal-footer row align-items-center mt-3">
				<div className="col-4">
					{page != 0 && (
						<Button className="carousel-prev"
							variant={ButtonVariant.None}
							onClick={prevPage}
							label={messages.previous} />)}
				</div>
				<ul className="col text-center carousel">
					{props.pages.map((x, i) => (
						<li key={x.key} className={mergeClasses(
							"blip", page == i && "active")} />))}
				</ul>
				<div className="col-4 text-right">
					{current.renderNext
						? current.renderNext(nextPage)
						: page != props.pages.length - 1 && (
							<Button className="carousel-next"
								onClick={nextPage}
								label={messages.next} />)}
				</div>
			</div></>);
}
