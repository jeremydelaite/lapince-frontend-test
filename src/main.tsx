import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import CategoriesProvider from "./context/CategoriesContext.tsx";
import { ProjectProvider } from "./context/ProjectContext.tsx";
import ProjectsProvider from "./context/ProjectsContext.tsx";
import { ThemeProvider } from "./context/ThemesContext.tsx";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="lapince-theme">
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<CategoriesProvider>
						<ProjectsProvider>
							<ProjectProvider>
								<App />
							</ProjectProvider>
						</ProjectsProvider>
					</CategoriesProvider>
				</AuthProvider>
			</QueryClientProvider>
			<Toaster position="top-right" richColors />
		</ThemeProvider>
	</StrictMode>,
);
