import deepCopy from "app/utils/deepcopy";
import { Vector2 } from "app/utils/Vector2";
import { getInitialTheme, WidgetProps } from "app/Widget";
import { WidgetTypes } from "app/widgets";
import { NotesProps } from "app/widgets/Notes";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { WidgetContainer } from "../WidgetContainer";


export default function OnboardingHelp() {
	const Notes = WidgetTypes["Notes"];
	const fakeWidget = useMemo<WidgetProps<NotesProps>>(() => ({
		child: Notes,
		save: () => {},
		remove: () => {},
		id: 3,
		type: "Notes",
		props: {
			notes: "",
		},
		theme: deepCopy(getInitialTheme(Notes)),
		position: new Vector2(0, 0),
		size: new Vector2(5, 4),
	}), []);

	return (
		<div className="modal-body onboarding">
			<div className="row row-gap features">
				<div className="one-half unlocked middle-center">
					<div className="widget widget-notes fake">
						<WidgetContainer {...fakeWidget} />
						<span className="react-resizable-handle react-resizable-handle-se fake-resizable-handle"></span>
					</div>
				</div>
				<div className="one-half middle-center">
					<div>
						<h3>
							<FormattedMessage
								defaultMessage="Drag and Drop Widgets" />
						</h3>
						<p>
							<FormattedMessage
								defaultMessage=
									"You can add, move, resize, and configure widgets on a grid using intuitive controls." />
						</p>
						<p>
							<FormattedMessage
								defaultMessage=
									"Use the move handle (<move></move>) and the resize handle (<resize></resize>)."
								values={{
									move: () => <i className="fas fa-grip-vertical" />,
									resize: () => <span className="fake-resizable-handle" />,
								}} />
						</p>
					</div>
				</div>
			</div>
		</div>);
}
