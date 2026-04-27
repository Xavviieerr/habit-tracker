export function getSession() {
	if (typeof window === "undefined") return null;

	const data = localStorage.getItem("session");
	return data ? JSON.parse(data) : null;
}
