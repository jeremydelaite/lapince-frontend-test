import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

type AuthMode = "login" | "register";

type AuthPageProps = {
	defaultMode: AuthMode;
};

export function AuthPage({ defaultMode }: AuthPageProps) {
	const [mode, setMode] = useState<AuthMode>(defaultMode);
	useEffect(() => {
		document.title =
			mode === "login" ? "La Pince – Connexion" : "La Pince – Inscription";
	}, [mode]);

	return (
		<main className="flex min-h-screen items-center justify-center px-4">
			<div className="w-full max-w-md">
				<Link
					to="/"
					className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" />
					Retour à l'accueil
				</Link>
				{mode === "login" ? (
					<LoginForm onRegisterClick={() => setMode("register")} />
				) : (
					<RegisterForm onLoginClick={() => setMode("login")} />
				)}
			</div>
		</main>
	);
}
