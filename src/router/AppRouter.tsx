import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthPage } from "@/pages/AuthPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { HomePage } from "@/pages/HomePage";
import { LegalsPage } from "@/pages/LegalsPage";
import { ProjectPage } from "@/pages/ProjectPage";
import { ProjectsPage } from "@/pages/ProjectsPage";

export function AppRouter() {
	return (
		<StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<AuthPage defaultMode="login" />} />
					<Route
						path="/register"
						element={<AuthPage defaultMode="register" />}
					/>
					<Route path="/testcategories" element={<CategoriesPage />} />
					<Route path="/projects" element={<ProjectsPage />} />
					<Route path="/project/:id" element={<ProjectPage />} />
					<Route path="/privacy-policy" element={<LegalsPage />} />
				</Routes>
			</BrowserRouter>
		</StrictMode>
	);
}
