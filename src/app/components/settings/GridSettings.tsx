import { useForceUpdateValue } from "app/hooks";
import { miscMessages } from "app/locale/common";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { Form } from "../forms";
import { makeGridSettingsSchema, WidgetGridSettings } from "../WidgetGrid";


export interface GridSettingsProps {
	grid: WidgetGridSettings;
	setGrid: (grid: WidgetGridSettings) => void;
}


export default function GridSettings(props: GridSettingsProps) {
	const [force, forceUpdate] = useForceUpdateValue();

	function handleSetGridValue(key: string, val: any) {
		(props.grid as any)[key] = val;
		props.setGrid({ ...props.grid! });
		forceUpdate();
	}

	const gridSettingsSchema = useMemo(
		() => makeGridSettingsSchema(props.grid),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props.grid, force]);

	return (
		<div className="modal-body">
			<p>
				<FormattedMessage
					{...miscMessages.widgetsHaveSettings}
					values={{ b: (chunk: any) => (<b>{chunk}</b>) }} />
			</p>

			<Form
				values={props.grid}
				schema={gridSettingsSchema}
				onChange={handleSetGridValue} />
		</div>);
}
