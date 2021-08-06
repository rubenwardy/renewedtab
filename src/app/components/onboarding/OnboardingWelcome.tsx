import React from "react";
import { FormattedMessage } from "react-intl";

export default function OnboardingWelcome() {
	return (
		<div className="modal-body onboarding">
			<div className="row row-gap my- features">
				<div className="one-half">
					<img className="w-100" src="onboarding_widgets.png" />
				</div>
				<div className="one-half">
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
		</div>);
}
