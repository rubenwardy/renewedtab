import { mergeClasses } from "app/utils";
import React, { CSSProperties, ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

export interface ModalProps {
	title: string;
	onClose?: () => void;
	children: ReactNode[] | ReactNode;
	lighterBg?: boolean;
	wide?: boolean;
}

export default function Modal(props: ModalProps) {
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
			if (e.key == "Escape" && props.onClose) {
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
		if (didClickBegin && props.onClose) {
			props.onClose();
		}
		setDidClickBegin(false);
	}

	const bgClasses = mergeClasses("modal-bg",
		props.lighterBg && "modal-bg-lighter");

	return ReactDOM.createPortal((
		<aside className={bgClasses} onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp} style={style}>
			<div className={mergeClasses("flush modal", props.wide === true && "modal-wide")}
					onMouseDown={(e) => e.stopPropagation()}
					onMouseUp={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2>{props.title}</h2>
					{props.onClose && (
						<button className="btn modal-close" onClick={props.onClose}>
							<i className="fas fa-times" />
						</button>)}
				</div>
				{props.children}
			</div>
		</aside>
	), document.getElementById("app")!);
}
