import { useRef, useLayoutEffect } from "react";

/**
* Automatically scales a HTML TextArea element to the height of its content,
* or the specified max-height, whichever is smaller. Returns a ref to attach to
* the TextArea which should be scaled.
*
* @param {number} maxHeight - An optional maximum height, defaults to Infinity.
* @param {any[]} dependents - A list of dependent variables for the TextArea's content.
* @return {RefObject} - A RefObject to attach to the targeted TextArea.
*/
export function useAutoTextArea(maxHeight?: number, dependents?: any[]): React.RefObject<HTMLTextAreaElement> {
	const ref = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;
		ref.current.style.height = '';
		ref.current.style.height = Math.min(ref.current.scrollHeight + 2, maxHeight ?? Infinity) + 'px';
	}, [ ref.current, ...dependents || [] ]);

	return ref;
}
