import React, { CSSProperties, ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

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

	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		window.requestAnimationFrame(() => setMounted(true));
	}, []);

	const style: CSSProperties = {};
	if (mounted) {
		style.opacity = 1;
	}

	return ReactDOM.createPortal((
		<aside className="modal-bg" onClick={props.onClose} style={style}>
			<div className="panel flush modal" onClick={(e) => e.stopPropagation()}>
				<h2 className="modal-header">
					<a className="btn modal-close" onClick={props.onClose}>x</a>
					{props.title}
				</h2>
				{props.children}
			</div>
		</aside>
	), document.getElementById("app")!);
}
