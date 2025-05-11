import { useState } from "react";

export function useForceUpdateValue(): [unknown, () => void] {
	const [force, setForce] = useState({});
	return [force, () => setForce({})];
}

export default function useForceUpdate(): () => void {
	const [, forceUpdate] = useForceUpdateValue();
	return forceUpdate;
}
