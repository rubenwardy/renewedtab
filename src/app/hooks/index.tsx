import { useState } from "react";

export * from "./promises";
export * from "./http";
export * from "./storage";


export function useForceUpdate(): () => void {
	const [, setForce] = useState({});
	return () => setForce({});
}

export function useForceUpdateValue(): [any, () => void] {
	const [force, setForce] = useState({});
	return [force, () => setForce({})];
}
