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

	const [didClickBegin, setDidClickBegin] = useState(false);

	const style: CSSProperties = {};
	if (mounted) {
		style.opacity = 1;
	}

	useEffect(() => {
		function close(e: KeyboardEvent) {
			if (e.key == "Escape") {
				props.onClose()
			}
		}

		window.addEventListener('keydown', close);
		return () => window.removeEventListener('keydown', close);
	}, []);



	function handleMouseDown() {
		setDidClickBegin(true);
	}

	function handleMouseUp() {
		if (didClickBegin) {
			props.onClose();
		}
		setDidClickBegin(false);
	}

	return ReactDOM.createPortal((
		<aside className="modal-bg" onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp} style={style}>
			<div className="panel flush modal"
					onMouseDown={(e) => e.stopPropagation()}
					onMouseUp={(e) => e.stopPropagation()}>
				<h2 className="modal-header">
					<a className="btn modal-close" onClick={props.onClose}>
						<i className="fas fa-times" />
					</a>
					{props.title}
				</h2>
				{props.children}
			</div>
		</aside>
	), document.getElementById("app")!);
}
