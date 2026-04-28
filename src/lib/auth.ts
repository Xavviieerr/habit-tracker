import { STORAGE_KEYS } from "./constants";
import type { User, Session } from "@/types/auth";
import { validateEmail, validatePassword } from "./validators";

//users
function getUsers(): User[] {
	if (typeof window === "undefined") return [];

	const raw = localStorage.getItem(STORAGE_KEYS.USERS);
	return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: User[]) {
	localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

//sessions
export function getSession() {
	if (typeof window === "undefined") return null;

	const data = localStorage.getItem(STORAGE_KEYS.SESSION);
	return data ? JSON.parse(data) : null;
}

function setSession(session: Session) {
	localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

//sign-up
export function signup(email: string, password: string) {
	const emailError = validateEmail(email);
	if (emailError) throw new Error(emailError);

	const passwordError = validatePassword(password);
	if (passwordError) throw new Error(passwordError);

	const users = getUsers();

	const existing = users.find((user) => user.email === email);
	if (existing) {
		throw new Error("User already exists");
	}

	const newUser: User = {
		id: crypto.randomUUID(),
		email,
		password,
		createdAt: new Date().toISOString(),
	};

	const updatedUsers = [...users, newUser];
	saveUsers(updatedUsers);

	setSession({
		userId: newUser.id,
		email: newUser.email,
	});

	return newUser;
}

export function login(email: string, password: string) {
	const emailError = validateEmail(email);
	if (emailError) throw new Error(emailError);

	const passwordError = validatePassword(password);
	if (passwordError) throw new Error(passwordError);

	const users = getUsers();

	const user = users.find((user) => user.email === email);
	if (!user) {
		throw new Error("Invalid email or password");
	}

	if (user.password !== password) {
		throw new Error("Invalid email or password");
	}

	const session: Session = {
		userId: user.id,
		email: user.email,
	};

	setSession(session);

	return session;
}
