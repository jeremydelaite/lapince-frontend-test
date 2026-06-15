import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

type RegisterFormProps = {
	onLoginClick: () => void;
};

export function RegisterForm({ onLoginClick }: RegisterFormProps) {
	const { register } = useAuth();
	const [errorMessage, setErrorMessage] = useState("");

	async function handleAction(formData: FormData) {
		setErrorMessage("");

		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		if (password !== confirmPassword) {
			setErrorMessage("Les mots de passe ne sont pas identiques");
			return;
		}

		try {
			await register({ name, email, password });
			// Registration successful → switch to login form
			toast.success("Compte créé !", {
				description: "Bienvenue sur La Pince 🎉",
			});
			onLoginClick();
		} catch {
			setErrorMessage("Une erreur est survenue, veuillez réessayer");
			toast.error("Inscription échouée", {
				description: "Une erreur est survenue, veuillez réessayer",
			});
		}
	}

	return (
		<form action={handleAction} className="space-y-5">
			<header>
				<h2 className="text-2xl font-semibold tracking-tight">
					Créer un compte
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					30 secondes, pas de carte bancaire.
				</p>
			</header>

			<div className="space-y-2">
				<Label htmlFor="register-name">Nom</Label>
				<Input
					id="register-name"
					name="name"
					type="text"
					placeholder="Dupuis"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="register-email">Adresse email</Label>
				<Input
					id="register-email"
					name="email"
					type="email"
					placeholder="lapince@famille.fr"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="register-password">Mot de passe</Label>
				<p className="mt-1 text-sm text-muted-foreground">
					Au moins 8 caractères avec une majuscule, une minuscule et un chiffre.
				</p>
				<Input
					id="register-password"
					name="password"
					type="password"
					placeholder="Min. 8 caractères, 1 maj, 1 min, 1 chiffre"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="register-confirm-password">
					Confirmer le mot de passe
				</Label>
				<Input
					id="register-confirm-password"
					name="confirmPassword"
					type="password"
					placeholder="••••••••"
					required
				/>
			</div>

			{errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

			<Button type="submit" className="w-full">
				S&apos;inscrire
			</Button>

			<p className="text-center text-sm text-muted-foreground">
				Déjà un compte ?{" "}
				<button
					type="button"
					onClick={onLoginClick}
					className="font-medium text-foreground hover:underline"
				>
					Connexion ici
				</button>
			</p>
		</form>
	);
}
