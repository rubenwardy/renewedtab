import { ActualBackgroundProps, BackgroundProvider } from "app/backgrounds/common";
import { getBackgroundProvider, getSchemaForProvider } from "app/backgrounds";
import { CacheExpiry } from "app/backgrounds/messages";
import { useForceUpdateValue, usePromise } from "app/hooks";
import { BackgroundConfig } from "app/hooks/background";
import { enumToValue } from "app/utils/enum";
import { toTypedJSON } from "app/utils/TypedJSON";
import React, { useMemo } from "react";
import ActualBackground from "./ActualBackground";
import { CreditsProps } from "./Credits";
import { BackgroundCache, clearBackgroundCache, getBackgroundCache, storeBackgroundCache } from "app/storage/database";


export interface BackgroundProps {
	background: BackgroundConfig | null;
	setWidgetsHidden?: (value: boolean) => void;
}




async function loadFromCache(key: string, provider: BackgroundProvider<any>): Promise<BackgroundCache | undefined> {
	if (!provider.enableCaching) {
		return undefined;
	}

	return getBackgroundCache(key);
}


function isNotExpired(fetchedAt: Date, expiry: CacheExpiry) {
	expiry = enumToValue(CacheExpiry, expiry);

	switch (expiry) {
	case CacheExpiry.Minutes15:
		return new Date().valueOf() < fetchedAt.valueOf() + 15 * 60 * 1000;
	case CacheExpiry.Hourly:
		return new Date().valueOf() < fetchedAt.valueOf() + 60 * 60 * 1000;
	case CacheExpiry.Daily:
		return new Date().getDate() == fetchedAt.getDate();
	default:
		throw new Error(`Unknown CacheExpiry ${expiry}`);
	}
}


async function updateBackground<T>(key: string, provider: BackgroundProvider<T>, values: T): Promise<ActualBackgroundProps | undefined> {
	const retval = await provider.get(values);
	if (retval && provider.enableCaching) {
		console.log("Filling background cache from provider");
		storeBackgroundCache({
			key,
			...retval,
			fetchedAt: new Date(),
		})
	}
	return retval;
}


async function loadBackground(provider: BackgroundProvider<any>,
		values: any): Promise<ActualBackgroundProps | undefined> {
	const key = `${provider.id}:${JSON.stringify(toTypedJSON(values))}`;
	const cache = await loadFromCache(key, provider);
	if (cache && values.cacheExpiry && isNotExpired(cache.fetchedAt, values.cacheExpiry ?? CacheExpiry.Hourly)) {
		console.log("Setting background from cache");
		return cache;
	}

	if (cache) {
		console.log("Setting background from cache, updating in the background");
		updateBackground(key, provider, values).catch(console.error);
		return cache;
	} else {
		console.log("Setting background from provider");
		return await updateBackground(key, provider, values);
	}
}


export default function Background(props: BackgroundProps) {
	const [force, forceUpdate] = useForceUpdateValue();
	const provider = getBackgroundProvider(props.background?.mode ?? "");

	const values = useMemo(() => {
		if (!provider) {
			return {};
		}

		const values: any = {};
		Object.keys(getSchemaForProvider(props.background!.mode)).forEach(key => {
			values[key] = props.background!.values[key];
		})
		return values;
	}, [props.background, provider]);

	const [actualBg] = usePromise(() =>
		provider ? loadBackground(provider, values) : Promise.resolve(null), [provider, values, force]);

	if (!actualBg || !provider) {
		return (<div id="background" />);
	}

	const credits = actualBg.credits ? { ... actualBg.credits } as CreditsProps : undefined;
	if (credits) {
		credits.setIsHovered = props.setWidgetsHidden;
		credits.onVoted = (isPositive) => {
			if (!isPositive) {
				if (provider.enableCaching) {
					clearBackgroundCache();
				}
				forceUpdate();
			}
		};
	}

	return (<ActualBackground {...actualBg} credits={credits} />);
}
