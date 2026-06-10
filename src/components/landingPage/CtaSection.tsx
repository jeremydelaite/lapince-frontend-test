import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function CtaSection() {
	return (
		<section className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
			<h2 className="text-3xl font-semibold tracking-tight">
				Prêt à reprendre le contrôle de votre budget ?
			</h2>

			<Button
				className="mt-8 bg-accent text-accent-foreground hover:bg-accent/80"
				render={
					<Link to="/register">
						Créer mon compte <ArrowRightIcon />
					</Link>
				}
			></Button>
		</section>
	);
}
