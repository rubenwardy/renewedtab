import posthog, { getIsPosthogOptedIn, waitForPosthogReady } from "./posthog";
import { storage } from "app/storage";
import type { Widget } from "app/Widget";


export function captureWidgetCreated(widgetType: string): void {
	posthog.capture("widget_created", { widget_type: widgetType });
}


export function captureWidgetDeleted(widgetType: string): void {
	posthog.capture("widget_deleted", { widget_type: widgetType });
}


export function captureWidgetDuplicated(widgetType: string): void {
	posthog.capture("widget_duplicated", { widget_type: widgetType });
}


export function captureWidgetSettingsOpened(widgetType: string,
		trigger: "button" | "keyboard"): void {
	posthog.capture("widget_settings_opened", { widget_type: widgetType, trigger });
}


export function captureWidgetSettingChanged(widgetType: string, settingKey: string,
		settingGroup: "props" | "theme"): void {
	posthog.capture("widget_setting_changed", {
		widget_type: widgetType,
		setting_key: settingKey,
		setting_group: settingGroup,
	});
}


export function captureGridLocked(): void {
	posthog.capture("grid_locked");
}


export function captureGridUnlocked(): void {
	posthog.capture("grid_unlocked");
}


export function captureOnboardingPresetApplied(presetId: string): void {
	posthog.capture("onboarding_preset_applied", { preset_id: presetId });
}


export function captureBackgroundChanged(backgroundMode: string): void {
	posthog.capture("background_changed", { background_mode: backgroundMode });
}


export function captureBackgroundVoteCast(vote: "like" | "block"): void {
	posthog.capture("background_vote_cast", { vote });
}


export function captureThemeReset(): void {
	posthog.capture("theme_reset");
}


export function captureDataReset(): void {
	posthog.capture("data_reset");
}


export function captureDailyActive(widgets: Widget<unknown>[]): void {
	// Don't mark today as reported if nothing would be sent
	if (!getIsPosthogOptedIn()) {
		return;
	}

	captureDailyActiveImpl(widgets).catch(console.error);
}


async function captureDailyActiveImpl(widgets: Widget<unknown>[]) {
	await waitForPosthogReady();
	if (!getIsPosthogOptedIn()) {
		return;
	}

	const today = new Date().toISOString().slice(0, 10);
	if (await storage.get<string>("analytics_reported_date") == today) {
		return;
	}
	await storage.set("analytics_reported_date", today);

	const counts = new Map<string, number>();
	for (const widget of widgets) {
		counts.set(widget.type, (counts.get(widget.type) ?? 0) + 1);
	}

	const [background, isLocked, showBookmarksBar, theme] = await Promise.all([
		storage.get<{ mode: string }>("background"),
		storage.get<boolean>("locked"),
		storage.get<boolean>("showBookmarksBar"),
		storage.get<Record<string, unknown>>("theme"),
	]);

	const setup = {
		widget_count: widgets.length,
		widget_types: [...counts.keys()].sort(),
		background_mode: background?.mode ?? "Curated",
		grid_locked: isLocked ?? false,
		bookmarks_bar: typeof browser !== "undefined" &&
			(showBookmarksBar ?? app_version.target == "chrome"),
		theme_settings_changed: Object.keys(theme ?? {})
			.filter(key => theme![key] !== undefined)
			.sort(),
	};

	posthog.capture("daily_active", setup);

	for (const [widgetType, count] of counts) {
		posthog.capture("widget_in_use", { widget_type: widgetType, widget_count: count });
	}

	posthog.setPersonProperties(setup);
}
