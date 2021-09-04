import { Vector2 } from "app/utils/Vector2";
import { useEffect, useRef, useState } from "react";

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


/**
 * Get element size
 *
 * @returns [ref, size]
 */
export function useElementSize<T extends HTMLElement>():
		[ React.RefObject<T>, Vector2 | undefined ] {
	const ref = useRef<T>(null);
	const [size, setSize] = useState<Vector2 | undefined>(undefined);

	function updateSize() {
		if (ref.current) {
			const newSize = new Vector2(ref.current.clientWidth, ref.current.clientHeight);
			if (size == undefined || !newSize.equals(size)) {
				setSize(newSize);
			}
		}
	}

	useEffect(() => {
		const timer = setInterval(() => {
			updateSize();
		}, 500);

		updateSize();

		return () => clearInterval(timer);
	}, []);

	return [ref, size];
}
