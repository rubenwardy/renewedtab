import { useState } from "react";

export * from "./promises";
export * from "./http";
export * from "./storage";
export * from "./background";


export function useForceUpdate(): () => void {
	const [, setForce] = useState({});
	return () => setForce({});
}
