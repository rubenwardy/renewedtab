import { ActualBackgroundProps, getBackgroundProvider } from "app/backgrounds";
import { usePromise } from "app/hooks";
import { BackgroundConfig } from "app/hooks/background";
import React from "react";
import ActualBackground from "./ActualBackground";


export interface BackgroundProps {
	background: BackgroundConfig | null;
	setWidgetsHidden?: (value: boolean) => void;
}


async function loadBackground(bg: (BackgroundConfig | null)): Promise<ActualBackgroundProps | null> {
	if (!bg) {
		return null;
	}

	const provider = getBackgroundProvider(bg.mode);
	if (!provider) {
		return null;
	}

	const values: any = {};
	Object.keys(provider.schema).forEach(key => {
		values[key] = bg.values[key];
	})

	return await provider.get(values);
}


export default function Background(props: BackgroundProps) {
	const [actualBg] = usePromise(() => loadBackground(props.background), [props.background]);
	if (actualBg) {
		if (actualBg.credits) {
			actualBg.credits.setIsHovered = props.setWidgetsHidden;
		}
		return (<ActualBackground {...actualBg} />);
	} else {
		return (<div id="background" />);
	}
}
