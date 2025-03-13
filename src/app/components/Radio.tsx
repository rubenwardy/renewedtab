import React, { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";

interface RadioContextData {
	name: string;
	value: string | undefined;
	setValue: (value: string) => void;
}

const RadioContext = createContext<RadioContextData| null>(null);

interface RadioGroupProps {
	name: string;
	selectedValue: string | undefined;
	onChange: (newValue: string) => void;
	children: React.ReactNode;
	className?: string;
}

export function RadioGroup(props: RadioGroupProps) {
	const [selected, setSelected] = useState(props.selectedValue);
	useEffect(() => setSelected(props.selectedValue), [props.selectedValue]);
	const {name, onChange} = props;

	const value: RadioContextData = useMemo(() => ({
		name,
		value: selected,
		setValue: (value) => {
			onChange(value);
			setSelected(value);
		},
	}), [selected, onChange]);

	return (
		<div className={props.className} role="radiogroup">
			<RadioContext.Provider value={value}>

				{props.children}
			</RadioContext.Provider>
		</div>);
}

interface RadioProps {
	value: string;
	disabled?: boolean;
}

export default function Radio({value, disabled}: RadioProps) {
	const context = useContext(RadioContext);
	return (
		<input type="radio" name={context?.name} value={value} checked={context?.value == value} disabled={disabled} onChange={() => context?.setValue(value)} />
	);
}
