import React, { ReactNode } from "react";

export interface ModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode[] | ReactNode;
}

export default function Modal(props: ModalProps) {
	if (!props.isOpen) {
		return null;
	}

	return (
		<aside className="modal" onClick={props.onClose}>
			<div className="panel flush modal-body" onClick={(e) => e.stopPropagation()}>
				<h2 className="panel-inset">{props.title}</h2>
				{props.children}
			</div>
		</aside>
	);
}
