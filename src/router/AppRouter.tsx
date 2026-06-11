import { StrictMode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { AuthPage } from "@/pages/AuthPage";
import ContactPage from "@/pages/ContactPage";
import { ForbiddenPage } from "@/pages/ForbiddenPage";
import { HomePage } from "@/pages/HomePage";
import { LegalsPage } from "@/pages/LegalsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProjectPage } from "@/pages/ProjectPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { Loader2 } from "lucide-react";

function PrivateRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	if (isLoading) return (
		<div className="flex h-screen items-center justify-center">
			<Loader2 className="size-8 animate-spin text-muted-foreground" />
		</div>
	);
	return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	if (isLoading) return (
		<div className="flex h-screen items-center justify-center">
			<Loader2 className="size-8 animate-spin text-muted-foreground" />
		</div>
	);
	return user ? <Navigate to="/projects" replace /> : <>{children}</>;
}

export function AppRouter() {
	return (
		<StrictMode>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<PublicRoute>
								<HomePage />
							</PublicRoute>
						}
					/>
					<Route
						path="/login"
						element={
							<PublicRoute>
								<AuthPage defaultMode="login" />
							</PublicRoute>
						}
					/>
					<Route
						path="/register"
						element={
							<PublicRoute>
								<AuthPage defaultMode="register" />
							</PublicRoute>
						}
					/>
					<Route
						path="/projects"
						element={
							<PrivateRoute>
								<ProjectsPage />
							</PrivateRoute>
						}
					/>
					<Route
						path="/project/:id"
						element={
							<PrivateRoute>
								<ProjectPage />
							</PrivateRoute>
						}
					/>
					<Route path="/privacy-policy" element={<LegalsPage />} />
					<Route path="/contact" element={<ContactPage />} />
					<Route path="/forbidden" element={<ForbiddenPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</BrowserRouter>
		</StrictMode>
	);
}
