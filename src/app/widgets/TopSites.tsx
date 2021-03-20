import LinkBox, { Link } from 'app/components/LinkBox';
import RequestPermission from 'app/components/RequestPermission';
import { useForceUpdate, usePromise } from 'app/hooks';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { getWebsiteIcon } from 'app/WebsiteIcon';
import React from 'react';


interface TopSitesProps {
	useIconBar: boolean;
}

function getAllIcons(sites: any[]): Promise<string[]> {
	return Promise.all(sites.map((site) => getWebsiteIcon(site.url)));
}

function TopSitesImpl(props: TopSitesProps) {
	const [sites, error] = usePromise(() => browser.topSites.get(), []);
	const [icons, _error2] = usePromise(() => getAllIcons(sites ?? []), [sites]);
	if (!sites) {
		return (
			<div className="panel text-muted">
				{error ? error.toString() : "Loading sites..."}
			</div>);
	}

	const links: Link[] = sites.map((site, i) => ({
		id: site.url,
		title: site.title,
		icon: (icons ?? [])[i] ?? "fa-globe-europe",
		url: site.url,
	}));

	console.log(links);

	return (<LinkBox {...props} links={links} />);
}

export default function TopSites(props: TopSitesProps)  {
	const forceUpdate = useForceUpdate();

	if (typeof browser.topSites === "undefined") {
		const permissions: browser.permissions.Permissions = {
			permissions: ["topSites"],
			origins: ["*://*/*"]
		};

		return (
			<div className="panel text-muted">
				<RequestPermission permissions={permissions}
						label={`Grant permission to access top sites`}
						onResult={forceUpdate} />
			</div>);
	}

	return (<TopSitesImpl {...props} />);
}


TopSites.description = "Shows top sites";

TopSites.isBrowserOnly = true;

TopSites.initialProps = {
	useIconBar: true,
};

TopSites.schema = {
	useIconBar: type.boolean("Display as icons"),
} as Schema;

TopSites.defaultSize = new Vector2(15, 2);
