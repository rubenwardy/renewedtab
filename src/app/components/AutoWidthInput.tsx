import React, { ChangeEvent, CSSProperties, KeyboardEvent, useRef } from "react";


interface AutoWidthInputProps {
	name?: string;
	value: string;
	placeholder?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	minWidth?: string;
	onFinished?: () => void;
}

export default function AutoWidthInput(props: AutoWidthInputProps) {
	const ref = useRef<HTMLDivElement>(null);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (ref.current) {
			ref.current.innerText = e.target.value;
			props.onChange(e);
		}
	}

	function onKeyPress(e: KeyboardEvent<HTMLInputElement>) {
		if (props.onFinished && e.key == "Enter") {
			props.onFinished();
		}
	}

	const style: CSSProperties = {}
	style.minWidth = props.minWidth;

	return (
		<span className="input-auto" style={style}>
			<span className="backing" ref={ref}>
				{props.value.trim().length > 0 ? props.value : (props.placeholder ?? "|")}
			</span>
			<input type="text" className="invisible" onChange={handleChange}
					onBlur={props.onFinished} value={props.value ?? ""}
					onKeyPress={onKeyPress} name={props.name}
					placeholder={props.placeholder} />
		</span>);
}
