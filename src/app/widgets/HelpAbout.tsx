import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import React from 'react';

export default function HelpAbout(_props: any) {
	return (
		<div className="panel">
			<h2>Homescreen Help and Tips</h2>
			<p>
				Welcome to homescreen. This is a web app designed to be used
				as a "New Tab" page in web browsers.
			</p>
			<p>
				Click "Add widget" in the bottom of the screen to add a widget.
				Also take a look at "Settings".
			</p>
			<p>
				To move, edit, or delete a widget, use the handle that appears
				in the top-right of the widget. To resize, use the drag
				handle in the bottom-right.
			</p>
		</div>);
}


HelpAbout.initialProps = {};

HelpAbout.schema = {} as Schema;

HelpAbout.defaultSize = new Vector2(5, 5);
