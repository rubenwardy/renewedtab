import { Vector2 } from "app/utils/Vector2";
import { useState, useCallback, useEffect, RefObject } from "react";


/**
* Get element size
*
* @returns [ref, size]
*/
export function useElementSize<T extends HTMLElement>(ref: RefObject<T>):
		(Vector2 | undefined) {
	const [size, setSize] = useState<Vector2 | undefined>(undefined);

	const updateSize = useCallback((node: T) => {
		const newSize = new Vector2(node.clientWidth, node.clientHeight);
		if (size == undefined || !newSize.equals(size)) {
			setSize(newSize);
		}
	}, [size]);

	useEffect(() => {
		if (typeof ResizeObserver != "function") {
			return;
		}

		const observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				updateSize(entry.target as T);
			}
		});

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, [updateSize, ref]);

	return size;
}
