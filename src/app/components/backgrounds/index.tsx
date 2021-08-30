import { ActualBackgroundProps, getBackgroundProvider, getSchemaForProvider } from "app/backgrounds";
import { useForceUpdateValue, usePromise } from "app/hooks";
import { BackgroundConfig } from "app/hooks/background";
import { fromTypedJSON, toTypedJSON } from "app/utils/TypedJSON";
import React, { useEffect, useMemo, useState } from "react";
import ActualBackground from "./ActualBackground";


export interface BackgroundProps {
	background: BackgroundConfig | null;
	setWidgetsHidden?: (value: boolean) => void;
}


interface BackgroundCache {
	key: string;
	value: ActualBackgroundProps;
}


export default function Background(props: BackgroundProps) {
	const [force, forceUpdate] = useForceUpdateValue();
	const provider = getBackgroundProvider(props.background?.mode ?? "");
	if (!provider) {
		useMemo(() => ({}), [props.background, provider]);
		useState(undefined);
		usePromise(async () => {}, [provider, {}, {}]);
		useEffect(() => {}, [null, {}]);
		return (<div id="background" />);
	}

	const values = useMemo(() => {
		const values: any = {};
		Object.keys(getSchemaForProvider(props.background!.mode)).forEach(key => {
			values[key] = props.background!.values[key];
		})
		return values;
	}, [props.background, provider]);

	const [actualBg, setActualBg] = useState<ActualBackgroundProps | undefined>(undefined);
	const [actualBgLoaded] = usePromise(() => provider.get(values), [provider, values, force]);

	useEffect(() => {
		if (provider.enableCaching) {
			const key = `${provider.id}:${JSON.stringify(toTypedJSON(values))}`;
			if (!actualBg) {
				const cachedJson = window.localStorage.getItem("_bg-cache");
				const cached: (BackgroundCache | undefined) = cachedJson ? fromTypedJSON(JSON.parse(cachedJson)) : undefined;
				if (cached) {
					if (cached.key == key) {
						console.log("Setting background from cache");
						setActualBg(cached.value);
						return;
					} else {
						console.log("Clearing background cache due to changed key");
						window.localStorage.removeItem("_bg-cache");
					}
				}
			}

			if (actualBgLoaded) {
				console.log("Filling background cache from provider");
				const toCache: BackgroundCache = {
					key,
					value: actualBgLoaded,
				};

				window.localStorage.setItem("_bg-cache", JSON.stringify(toTypedJSON(toCache)));
			}
		}

		if (actualBgLoaded && (!provider.enableCaching || !actualBg)) {
			console.log("Setting background from provider");
			setActualBg(actualBgLoaded);
		}
	}, [actualBgLoaded, force]);


	if (!actualBg) {
		return (<div id="background" />);
	}
	if (actualBg.credits) {
		actualBg.credits.setIsHovered = props.setWidgetsHidden;
		actualBg.credits.onVoted = () => {
			if (provider.enableCaching) {
				window.localStorage.removeItem("_bg-cache");
			}
			setActualBg(undefined);
			forceUpdate();
		};
	}
	return (<ActualBackground {...actualBg} />);
}
