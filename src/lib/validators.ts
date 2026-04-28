export function validateEmail(email: string) {
	if (!email) return "Email is required";

	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regex.test(email)) return "Invalid email address";

	return null;
}

export function validatePassword(password: string) {
	if (!password) return "Password is required";
	if (password.length < 6) return "Password must be at least 6 characters";

	return null;
}

export function validateHabitName(name: string): {
	valid: boolean;
	value: string;
	error: string | null;
} {
	const trimmed = name.trim();

	if (!trimmed) {
		return {
			valid: false,
			value: "",
			error: "Habit name is required",
		};
	}

	if (trimmed.length > 60) {
		return {
			valid: false,
			value: trimmed,
			error: "Habit name must be 60 characters or fewer",
		};
	}

	return {
		valid: true,
		value: trimmed,
		error: null,
	};
}
