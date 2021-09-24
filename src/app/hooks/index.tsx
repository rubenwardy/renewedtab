import { Vector2 } from "app/utils/Vector2";
import { useCallback, useMemo, useRef, useState } from "react";

export * from "./promises";
export * from "./http";
export * from "./storage";


export function useForceUpdate(): () => void {
	const [, setForce] = useState({});
	return () => setForce({});
}


export function useForceUpdateValue(): [unknown, () => void] {
	const [force, setForce] = useState({});
	return [force, () => setForce({})];
}


/**
* Get element size
*
* @returns [ref, size]
*/
export function useElementSize<T extends HTMLElement>():
		[any, Vector2 | undefined] {
	const [size, setSize] = useState<Vector2 | undefined>(undefined);
	function updateSize(node: T) {
		const newSize = new Vector2(node.clientWidth, node.clientHeight);
		if (size == undefined || !newSize.equals(size)) {
			setSize(newSize);
		}
	}

	if (typeof ResizeObserver == "function") {
		const resizeObserver = useMemo(() => new ResizeObserver(entries => {
			for (const entry of entries) {
				updateSize(entry.target as T);
			}
		}), []);

		const ref = useCallback((node: T) => {
			if (node === null) {
				resizeObserver.disconnect();
			} else {
				updateSize(node);
				resizeObserver.observe(node);
			}
		}, []);

		return [ref, size];
	} else {
		const ref = useRef<T>(null);
		return [ref, size];
	}

}
