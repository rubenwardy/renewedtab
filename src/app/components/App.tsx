import React, { useEffect, useState } from "react";
import { WidgetManager } from "app/WidgetManager";
import CreateWidgetDialog from "./CreateWidgetDialog";
import WidgetGrid, { defaultGridSettings, WidgetGridSettings } from "./WidgetGrid";
import SettingsDialog from "./settings/SettingsDialog";
import Background from "./backgrounds";
import { usePromise, useStorage } from "app/hooks";
import { defineMessage, defineMessages, FormattedMessage, IntlProvider, useIntl } from "react-intl";
import { getTranslation, getUserLocale } from "app/locale";
import { applyTheme, ThemeConfig } from "./settings/ThemeSettings";
import ReviewRequester from "./ReviewRequester";
import { storage } from "app/storage";
import * as Sentry from "@sentry/react";
import Onboarding from "./onboarding";
import { useBackground } from "app/hooks/background";
import { GlobalSearchContext } from "app/hooks/globalSearch";
import BookmarksTopBar from "./BookmarksTopBar";
import Button, { ButtonVariant } from "./Button";
import { miscMessages } from "app/locale/common";


const messages = defineMessages({
	newTab: {
		defaultMessage: "New Tab",
	},
});


function Title() {
	const intl = useIntl();

	if (typeof browser != "undefined") {
		document.title = intl.formatMessage(messages.newTab);
	}

	return null;
}


const widgetManager = new WidgetManager(storage);

export default function App() {
	const [loadingRes,] = usePromise(async () => {
		await widgetManager.load();
		return true;
	}, []);

	const [query, setQuery] = useState("");
	const [locale, setLocale] = useStorage<string>("locale", getUserLocale());
	const [showBookmarksBar, setShowBookmarksBar] = useStorage("showBookmarksBar", true);
	const [messages] = usePromise(() => locale ? getTranslation(locale) : Promise.reject(null), [locale]);
	const [background, setBackground] = useBackground();
	const [theme, setTheme] = useStorage<ThemeConfig>("theme", {});
	const [createIsOpen, setCreateOpen] = useState(false);
	const [settingsIsOpen, setSettingsOpen] = useState(false);
	const [widgetsHidden, setWidgetsHidden] = useState(false);
	const [isLockedRaw, setIsLocked] = useStorage<boolean>("locked", false);
	const [rawGridSettings, setGridSettings] = useStorage<WidgetGridSettings>(
		"grid_settings", { ...defaultGridSettings });
	const [onboardingIsOpen, setOnboardingIsOpen] = useState<boolean | undefined>(undefined);
	const isLocked = (isLockedRaw || onboardingIsOpen) ?? true;
	const loaded = loadingRes != null && messages != null;
	useEffect(() => {
		if (loaded && onboardingIsOpen == undefined) {
			setOnboardingIsOpen(widgetManager.widgets.length == 0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loaded]);

	const gridSettings = rawGridSettings && { ...defaultGridSettings, ...rawGridSettings };

	if (theme) {
		applyTheme(theme);
	}

	const classes: string[] = [];
	if (widgetsHidden) {
		classes.push("hidden");
	}

	classes.push(isLocked ? "locked" : "unlocked");

	return (
		<IntlProvider locale={(messages && locale) ? locale : "en"} defaultLocale="en" messages={messages ?? undefined}>
			<GlobalSearchContext.Provider value={{ query, setQuery }}>
				<Title />
				<div className={classes.join(" ")}>
					{showBookmarksBar && !onboardingIsOpen &&
						typeof browser !== "undefined" && (
						<BookmarksTopBar onHide={() => setShowBookmarksBar(false)} />)}
					<Sentry.ErrorBoundary fallback={<div id="background"></div>}>
						<Background background={background} setWidgetsHidden={setWidgetsHidden} />
					</Sentry.ErrorBoundary>
					{createIsOpen && (<CreateWidgetDialog
						manager={widgetManager}
						onClose={() => setCreateOpen(false)} />)}
					{gridSettings && (
						<SettingsDialog
							isOpen={settingsIsOpen}
							onClose={() => setSettingsOpen(false)}
							background={background} setBackground={setBackground}
							theme={theme} setTheme={setTheme}
							locale={locale ?? "en"} setLocale={setLocale}
							showBookmarksBar={showBookmarksBar ?? false} setShowBookmarksBar={setShowBookmarksBar}
							grid={gridSettings} setGrid={setGridSettings} />)}

					{loaded && gridSettings &&
						<WidgetGrid {...gridSettings} wm={widgetManager} isLocked={isLocked ?? false} />}
					{onboardingIsOpen && (
						<Onboarding
							onClose={() => setOnboardingIsOpen(false)}
							locale={locale ?? "en"} setLocale={setLocale}
							manager={widgetManager} />)}
					<ReviewRequester />

					{isLocked && !onboardingIsOpen && (
						<Button id="unlock-widgets" onClick={() => setIsLocked(false)}
							tabIndex={0} variant={ButtonVariant.None}
							className="text-shadow" icon="fas fa-pen" />)}

					{!isLocked && (
						<aside className="edit-bar">
							<Button href="https://renewedtab.com/help/"
								variant={ButtonVariant.Secondary}
								icon="fa fa-question" small={true}
								target="_blank"
								label={defineMessage({
									defaultMessage: "Help",
								})} />

							<p className="col m-0 pl-2 text-muted">
								<FormattedMessage
									defaultMessage="Make sure to check out settings, as you can configure many things." />
							</p>

							<Button onClick={() => setCreateOpen(true)}
								variant={ButtonVariant.Secondary}
								icon="fa fa-plus" small={true}
								label={defineMessage({
									defaultMessage: "Add Widget",
								})} />

							<Button onClick={() => setSettingsOpen(true)}
								variant={ButtonVariant.Secondary}
								icon="fa fa-cog" small={true}
								id="open-settings"
								label={defineMessage({
									defaultMessage: "Settings",
								})} />

							<Button onClick={() => setIsLocked(true)}
								variant={ButtonVariant.Secondary}
								icon="fa fa-check" small={true}
								label={miscMessages.finishEditing} />
						</aside>)}
				</div>
			</GlobalSearchContext.Provider>
		</IntlProvider>);
}
