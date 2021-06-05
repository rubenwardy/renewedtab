import { useXML } from "app/hooks/http";
import { Feed, parseFeed } from "app/utils/Feed";
import { useIntl } from "react-intl";

export function useFeed(url: string, dependents?: any[]): [Feed | undefined, any] {
	const intl = useIntl();

	if (!url) {
		return [undefined,
				intl.formatMessage({
					defaultMessage: "Missing feed URL."
				})];
	}

	const [data, error] = useXML(url, dependents);
	if (!data || error) {
		return [undefined, error];
	}

	const feed = parseFeed(data.children[0], (s, l) => new window.DOMParser().parseFromString(s, l as any));
	if (!feed) {
		return [undefined,
				intl.formatMessage({
					defaultMessage: "Error loading feed. Make sure it is an RSS or Atom feed."
				})];
	}

	return [feed, undefined];
}
