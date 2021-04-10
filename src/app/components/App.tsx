import React, { useState } from "react";
import { WidgetManager } from "app/WidgetManager";
import CreateWidgetDialog from "./CreateWidgetDialog";
import WidgetGrid from "./WidgetGrid";
import SettingsDialog from "./settings/SettingsDialog";
import Background from "./backgrounds";
import { useBackground, usePromise, useStorage } from "app/hooks";
import { ErrorBoundary } from "./ErrorBoundary";
import { FormattedMessage, IntlProvider } from "react-intl";
import getTranslation, { getUserLocale } from "app/locale";
import { applyTheme, ThemeConfig } from "./settings/ThemeSettings";
import ReviewRequester from "./ReviewRequester";


const widgetManager = new WidgetManager();

export default function App() {
	usePromise(() => widgetManager.load(), []);

	const [locale, _setLocale] = useState(getUserLocale());
	const messages = getTranslation(locale);

	const [background, setBackground] = useBackground();
	const [theme, setTheme] = useStorage<ThemeConfig>("theme", {});
	const [createIsOpen, setCreateOpen] = useState(false);
	const [settingsIsOpen, setSettingsOpen] = useState(false);
	const [widgetsHidden, setWidgetsHidden] = useState(false);
	const [isLocked, setIsLocked] = useStorage<boolean>("locked", false);

	if (theme) {
		applyTheme(theme);
	}

	const classes: string[] = [];
	if (widgetsHidden) {
		classes.push("hidden");
	}

	classes.push(isLocked ? "locked" : "unlocked");

	return (
		<IntlProvider locale={locale} defaultLocale="en" messages={messages}>
			<div className={classes.join(" ")}>
				<ErrorBoundary errorChild={() => (<div id="background"></div>)}>
					<Background background={background} setWidgetsHidden={setWidgetsHidden} />
				</ErrorBoundary>
				<CreateWidgetDialog isOpen={createIsOpen}
						manager={widgetManager}
						onClose={() => setCreateOpen(false)} />
				<SettingsDialog isOpen={settingsIsOpen}
						onClose={() => setSettingsOpen(false)}
						background={background} setBackground={setBackground}
						theme={theme} setTheme={setTheme} />
				<WidgetGrid wm={widgetManager} isLocked={isLocked ?? false} />

				<ReviewRequester />

				<footer className="text-shadow-soft">
					{isLocked && (
						<a onClick={() => setIsLocked(false)} tabIndex={0}>
							<i className={"large fas mr-1 " +
									(isLocked ? "fa-lock" : "fa-lock")} />
						</a>)}

					{!isLocked && (
						<>
							<a onClick={() => setCreateOpen(true)} tabIndex={0}>
								<i className="fas fa-plus mr-1" />
								<FormattedMessage
										defaultMessage="Add Widget" />
							</a>
							<a onClick={() => setSettingsOpen(true)} className="ml-3">
								<i className="large fas fa-cog" />
							</a>
							<a onClick={() => setIsLocked(true)} className="ml-3">
								<i className="large fas mr-1 fa-lock-open" />
							</a>
						</>)}
				</footer>
			</div>
		</IntlProvider>);
}
