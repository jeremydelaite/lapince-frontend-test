import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

type LoginFormProps = {
	onRegisterClick: () => void;
};

export function LoginForm({ onRegisterClick }: LoginFormProps) {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");

	async function handleAction(formData: FormData) {
		setErrorMessage("");

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			await login({ email, password });
			// Login successful → redirect to projects page
			navigate("/projects");
		} catch {
			setErrorMessage("Email ou mot de passe incorrect");
		}
	}

	return (
		<form action={handleAction} className="space-y-5">
			<header>
				<h2 className="text-2xl font-semibold tracking-tight">
					Bon retour parmi nous
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Connectez-vous à votre compte.
				</p>
			</header>

			<div className="space-y-2">
				<Label htmlFor="login-email">Adresse email</Label>
				<Input
					id="login-email"
					name="email"
					type="email"
					placeholder="lapince@famille.fr"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="login-password">Mot de passe</Label>
				<Input
					id="login-password"
					name="password"
					type="password"
					placeholder="••••••••"
					required
				/>
			</div>

			{errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

			<Button type="submit" className="w-full">
				Se connecter
			</Button>

			<p className="text-center text-sm text-muted-foreground">
				Pas encore de compte ?{" "}
				<button
					type="button"
					onClick={onRegisterClick}
					className="font-medium text-foreground hover:underline"
				>
					S&apos;inscrire ici
				</button>
			</p>
		</form>
	);
}
