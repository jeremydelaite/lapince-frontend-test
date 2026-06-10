import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { ConnectedHeader } from "@/components/common/ConnectedHeader";
import { PublicFooter } from "@/components/landingPage/PublicFooter";
import { PublicHeader } from "@/components/landingPage/PublicHeader";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemesContext";

export function ForbiddenPage() {
	const { theme } = useTheme();
	const { user } = useAuth();
	const isDark =
		theme === "dark" ||
		(theme === "system" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);
	useEffect(() => {
		document.title = "La Pince – Accès refusé";
	}, []);
	return (
		<div className="min-h-screen w-full">
			{user ? <ConnectedHeader /> : <PublicHeader />}
			<main>
				<section className="mx-auto w-full max-w-3xl px-10 py-20 text-center sm:px-6 lg:px-8">
					<Link
						to="/"
						className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="size-4" />
						{user ? "Retour aux projets" : "Retour à l'accueil"}
					</Link>
					<h2 className="text-3xl font-semibold tracking-tight">
						Accès refusé <br />
						La Pince est désolée. <br />
						Pas de pince, pas de surimi.
					</h2>
					<img
						src={isDark ? "/lapince404dark.png" : "/lapince404.png"}
						alt="La Pince a fouillé partout, mais cette page est introuvable"
						className="mx-auto mt-8 w-64 md:w-80 lg:w-96 h-auto"
					/>
				</section>
			</main>
			<PublicFooter />
		</div>
	);
}
