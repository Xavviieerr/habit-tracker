export function getItem<T>(key: string, fallback: T): T {
	if (typeof window === "undefined" || !window.localStorage) return fallback;

	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export function setItem<T>(key: string, value: T) {
	if (typeof window === "undefined" || !window.localStorage) return;
	localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string) {
	if (typeof window === "undefined" || !window.localStorage) return;
	localStorage.removeItem(key);
}
