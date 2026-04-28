import { STORAGE_KEYS } from "./constants";
import type { User, Session } from "@/types/auth";
import { validateEmail, validatePassword } from "./validators";
import { getItem, setItem, removeItem } from "./storage";

//users
function getUsers(): User[] {
	return getItem<User[]>(STORAGE_KEYS.USERS, []);
}

function saveUsers(users: User[]) {
	setItem(STORAGE_KEYS.USERS, users);
}

//sessions
export function getSession(): Session {
	return getItem(STORAGE_KEYS.SESSION, null);
}

export function setSession(session: Session) {
	setItem(STORAGE_KEYS.SESSION, session);
}

export function clearSession() {
	removeItem(STORAGE_KEYS.SESSION);
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
