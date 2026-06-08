import { createContext, useCallback, useContext, useState } from "react";
import type IProject from "@/types/project";

const BASE_URL = import.meta.env.VITE_API_URL;

// ── Projects context type ─────────────────────────────────────────────────────────────

interface IProjectsContexte {
	isLoading: boolean;
	error: string | null;
	errorCode: number | null;
	project: IProject | null;
	getProjectById: (projectId: number) => void;
}

// ── Projects context creation ─────────────────────────────────────────────────────────────

export const ProjectsContext = createContext<IProjectsContexte | undefined>(
	undefined,
);

interface ProjectsProviderProps {
	children: React.ReactNode;
}

// ── Projects provider ─────────────────────────────────────────────────────────────

export default function ProjectsProvider({ children }: ProjectsProviderProps) {
	const [project, setProject] = useState<IProject | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [errorCode, setErrorCode] = useState<number | null>(null);

	//TODO : Later refactoring this part with a service handling queries
	const getProjectById = useCallback(async (projectId: number) => {
		const token = localStorage.getItem("token");
		setIsLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				setErrorCode(response.status);
			}
			const data = await response.json();
			setProject(data.project);
			setError(null);
		} catch (error) {
			setProject(null);

			setError(
				error instanceof Error
					? error.message
					: `Error fetching project: ${projectId}`,
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const value = {
		project,
		isLoading,
		error,
		errorCode,
		getProjectById,
	};

	return (
		<ProjectsContext.Provider value={value}>
			{children}
		</ProjectsContext.Provider>
	);
}

// ── Custom hook ───────────────────────────────────────────────────────────────
// Gives any component access to the project
export function useProjects() {
	const context = useContext(ProjectsContext);
	if (!context) {
		throw new Error("useProjects must be used in a un ProjectsProvider");
	}
	return context;
}
