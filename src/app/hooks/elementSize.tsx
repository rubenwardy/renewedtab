import { Vector2 } from "app/utils/Vector2";
import { useState, RefObject, useLayoutEffect } from "react";


/**
* Get element size
*
* @returns [ref, size]
*/
export function useElementSize<T extends HTMLElement>(ref: RefObject<T>):
		(Vector2 | undefined) {
	const [size, setSize] = useState<Vector2 | undefined>(undefined);

	useLayoutEffect(() => {
		if (typeof ResizeObserver != "function") {
			return;
		}

		const observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				const newSize = new Vector2(entry.target.clientWidth, entry.target.clientHeight);
				setSize(newSize);
			}
		});

		if (ref.current) {
			const newSize = new Vector2(ref.current.clientWidth, ref.current.clientHeight);
			setSize(newSize);
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	// ref.current is definitely needed here
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setSize, ref, ref.current]);

	return size;
}
