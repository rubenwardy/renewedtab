import { useState } from "react";

export * from "./promises";
export * from "./http";
export * from "./storage";
export * from "./background";


export function useForceUpdate() {
	const [_, setForce] = useState({});
	return () => setForce({});
}
