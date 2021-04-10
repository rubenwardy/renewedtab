import debounce from "app/utils/debounce";
import { WidgetProps } from "app/Widget";
import { useMemo } from "react";
import { useForceUpdate } from ".";


export function useWidgetProp<T>(widget: WidgetProps<any>, key: string): [ T, (v: T | undefined) => void ] {
	const forceUpdate = useForceUpdate();
	const save = useMemo(() => debounce(() => widget.save(), 500), [ key ]);

	const value = widget.props[key];
	function setValue(value: T | undefined) {
		widget.props[key] = value;
		save();
		forceUpdate();
	}

	return [ value, setValue ];
}
