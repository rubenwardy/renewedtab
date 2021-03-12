import React, { ChangeEvent, useRef } from "react";


interface AutoWidthInputProps {
	value: string;
	placeholder?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function AutoWidthInput(props: AutoWidthInputProps) {
	const ref = useRef<HTMLDivElement>(null);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (ref.current) {
			ref.current.innerText = e.target.value;
			props.onChange(e);
		}
	}

	return (
		<span className="input-auto">
			<span className="backing" ref={ref}>
				{props.value.trim().length > 0 ? props.value : (props.placeholder ?? "|")}
			</span>
			<input className="invisible" onChange={handleChange}
					value={props.value ?? ""} placeholder={props.placeholder} />
		</span>);
}
