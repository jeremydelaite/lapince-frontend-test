import {
	FileTextIcon,
	LandmarkIcon,
	LogOutIcon,
	MailIcon,
	MoonIcon,
	SunIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemesContext";

export function ConnectedHeader() {
	const { logout, user } = useAuth();
	const navigate = useNavigate();
	const { theme, setTheme } = useTheme();

	const isDark =
		theme === "dark" ||
		(theme === "system" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);
	function toggleDark() {
		setTheme(isDark ? "light" : "dark");
	}

	async function handleLogout() {
		await logout();
		toast.success("Vous êtes déconnecté");
		navigate("/login");
	}
	return (
		<header className="border-b bg-background">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
				<Link to="/projects" className="flex items-center gap-2 font-semibold">
					<span className="inline-flex size-7 items-center justify-center rounded bg-primary text-primary-foreground">
						<LandmarkIcon className="size-4" />
					</span>

					<span>LaPince</span>
				</Link>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={toggleDark}
						aria-label={
							isDark ? "Activer le thème clair" : "Activer le thème sombre"
						}
						title={
							isDark ? "Activer le thème clair" : "Activer le thème sombre"
						}
						className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-foreground hover:text-foreground"
					>
						{isDark ? (
							<SunIcon className="size-4" />
						) : (
							<MoonIcon className="size-4" />
						)}
					</button>

					<DropdownMenu>
						<DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium transition hover:border-foreground">
							{/* User's initials */}
							{user?.name.slice(0, 2).toUpperCase()}
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end">
							<div className="px-2 py-1.5">
								<p className="text-sm font-medium">{user?.name}</p>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => navigate("/contact")}>
								<MailIcon className="size-4" />
								Contact
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate("/privacy-policy")}>
								<FileTextIcon className="size-4" />
								Mentions légales
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={handleLogout}
							>
								<LogOutIcon className="size-4" />
								Déconnexion
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
