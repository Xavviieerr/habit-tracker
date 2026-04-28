const CACHE_NAME = "Habit-tracker";

const APP_SHELL = ["/", "/login", "/signup", "/dashboard"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(APP_SHELL);
		}),
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((cached) => {
			return (
				cached ||
				fetch(event.request).catch(() => {
					// fallback = prevents hard crash
					return caches.match("/");
				})
			);
		}),
	);
});
