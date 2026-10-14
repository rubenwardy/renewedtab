import { storage } from "app/storage";


const STORAGE_KEY = "analytics_consent_bucket";


/**
 * A random number in [0, 100) used to roll out the analytics
 * consent request to existing users gradually
 */
export async function getAnalyticsConsentBucket(): Promise<number> {
	let bucket = await storage.get<number>(STORAGE_KEY);
	if (bucket == undefined) {
		bucket = Math.floor(Math.random() * 100);
		await storage.set(STORAGE_KEY, bucket);
	}
	return bucket;
}

export async function clearAnalyticsConsentBucket(): Promise<void> {
	await storage.remove(STORAGE_KEY);
}
