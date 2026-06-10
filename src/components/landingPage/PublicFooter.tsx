import { Link } from "react-router";

export function PublicFooter() {
	return (
		<footer className="w-full border-t bg-background">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
				<p>© 2026 LaPince</p>

				<nav className="flex items-center gap-6">
					<Link to="/privacy-policy" className="hover:text-foreground">
						Mentions légales
					</Link>
					{/* <a href="/" className="hover:text-foreground">
						CGU
					</a> */}
					<Link to="/contact" className="hover:text-foreground">
						Contact
					</Link>
				</nav>
			</div>
		</footer>
	);
}
