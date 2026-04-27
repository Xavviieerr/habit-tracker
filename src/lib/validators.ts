export function validateEmail(email: string) {
	if (!email) return "Email is required";

	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regex.test(email)) return "Invalid email format";

	return null;
}

export function validatePassword(password: string) {
	if (!password) return "Password is required";
	if (password.length < 6) return "Password must be at least 6 characters";

	return null;
}
