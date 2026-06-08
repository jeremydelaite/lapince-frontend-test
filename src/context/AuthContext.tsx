import { createContext, useContext, useEffect, useState } from "react";
import type { LoginPayload, RegisterPayload } from "@/services/api";
import { apiLogin, apiLogout, apiMe, apiRegister } from "@/services/api";
import type { User } from "@/types";

// ── Context type ─────────────────────────────────────────────────────────────

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	login: (payload: LoginPayload) => Promise<void>;
	logout: () => Promise<void>;
	register: (payload: RegisterPayload) => Promise<void>;
};

// ── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────

type AuthProviderProps = {
	children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	// true while we check if the stored token is still valid on mount
	const [isLoading, setIsLoading] = useState(true);

	// On mount : if a token exists in localStorage, verify it with GET /api/auth/me
	// This re-hydrates the user without asking them to log in again
	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			setIsLoading(false);
			return;
		}

		apiMe()
			.then(({ user }) => setUser(user))
			.catch(() => {
				// Token expired or invalid — silent cleanup
				localStorage.removeItem("token");
			})
			.finally(() => setIsLoading(false));
	}, []);

	// Calls POST /api/auth/login, stores the token, sets the user
	async function login(payload: LoginPayload) {
		const { user, token } = await apiLogin(payload);
		localStorage.setItem("token", token);
		setUser(user);
	}

	// Calls POST /api/auth/logout, clears the token, resets the user
	async function logout() {
		await apiLogout().catch(() => {
			// Log out client-side even if the request fails
		});
		localStorage.removeItem("token");
		setUser(null);
	}

	// Calls POST /api/auth/register — no auto-login after register
	async function register(payload: RegisterPayload) {
		await apiRegister(payload);
	}

	const value = {
		user,
		isLoading,
		login,
		logout,
		register,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Custom hook ───────────────────────────────────────────────────────────────

// Gives any component access to the auth box
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used inside an AuthProvider");
	}
	return context;
}
