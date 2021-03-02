import React from "react";

export function Search(_props: any) {
	return (<form method="get" action="https://duckduckgo.com" className="panel flush">
		<input autoFocus={true} type="text" name="q" placeholder="Search on DuckDuckGo" className="large invisible" />
	</form>);
}
