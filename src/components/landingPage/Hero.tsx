import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemesContext";

export function Hero() {
	const { theme } = useTheme();
	const isDark =
		theme === "dark" ||
		(theme === "system" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);
	return (
		<section className="w-full border-b bg-background">
			<div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
				<div>
					<h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
						Gérez vos budgets, simplement et ensemble.
					</h1>

					<p className="mt-6 text-lg text-muted-foreground">
						Suivez vos dépenses, planifiez vos objectifs et partagez les comptes
						avec toute la famille et vos amis — en temps réel.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-4">
						<Button
							className="bg-primary text-primary-foreground hover:bg-primary/80"
							render={<Link to="/register">Commencer</Link>}
						>
							Commencer
							<ArrowRightIcon />
						</Button>

						<Button
							variant="outline"
							render={<Link to="/login">J'ai déjà un compte</Link>}
						></Button>
					</div>
				</div>

				<div className="flex items-center justify-center rounded-lg overflow-hidden border border-border">
					<img
						src={isDark ? "/dashboard.dark.png" : "/dashboard.png"}
						alt="Aperçu du dashboard LaPince"
						className="w-full h-auto rounded-lg"
					/>
				</div>
			</div>
		</section>
	);
}
