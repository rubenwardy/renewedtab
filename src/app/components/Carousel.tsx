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


interface CarouselProps {
	children: ReactNode[];
}


export default function Carousel(props: CarouselProps) {
	const [page, setPage] = useState(0);
	function prevPage() {
		setPage(Math.max(0, page - 1));
	}
	function nextPage() {
		if (page < props.children.length - 1) {
			setPage(page + 1);
		}
	}

	return (
		<>
			{props.children[page]}
			<div className="modal-body row align-items-center mt-3">
				<div className="col-2">
					{page != 0 && (
						<Button className="carousel-prev"
							variant={ButtonVariant.None}
							onClick={prevPage}
							label={messages.previous} />)}
				</div>
				<ul className="col text-center carousel">
					{props.children.map((x, i) => (
						<li key={i} className={mergeClasses(
							"blip", page == i && "active")} />))}
				</ul>
				<div className="col-2 text-right">
					{page != props.children.length - 1 && (
						<Button className="carousel-next"
							onClick={nextPage}
							label={messages.next} />)}
				</div>
			</div></>);
}
