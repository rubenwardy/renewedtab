import React from "react";

export default function AboutSettings(_props: any) {
	function handleReset() {
		localStorage.clear();
		location.reload();
	}

	return (
		<div className="modal-body">
			<p>
				Welcome to homescreen. This is a web app and browser extension
				designed to be used as a "New Tab" page in web browsers.
			</p>
			<p>
				Created by <a href="https://rubenwardy.com">rubenwardy</a>.
				Licensed under GPLv2 or later,&nbsp;
				<a href="https://gitlab.com/rubenwardy/homescreen/">source code</a>.
			</p>
			<p>
				<a className="btn btn-danger" onClick={handleReset}>Reset everything</a>
			</p>
		</div>);
}
