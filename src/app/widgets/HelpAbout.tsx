import React from 'react';

export default function HelpAbout(_props: any) {
	return (
		<div className="panel">
			<h2>Homescreen</h2>
			<p>
				Welcome to homescreen. This is a web app designed to be used
				as a "New Tab" page in web browsers.
			</p>
			<p>
				Click "Add widget" in the top-left of the screen to add a widget.
			</p>
			<p>
				Hover over the top-right of a widget to edit or delete it.
			</p>
		</div>);
}


HelpAbout.defaultProps = {};

HelpAbout.defaultSize = { x: 5, y: 4 };
