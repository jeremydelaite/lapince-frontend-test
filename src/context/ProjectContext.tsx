import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import {
	apiGetBalance,
	apiGetBudgets,
	apiUpdateParticipantsProject,
	apiUpdateProject,
} from "@/services/api";
import type { BudgetSummary } from "@/types/budget";
import type IProject from "@/types/project";
import type {
	IParticipant,
	UpdateProjectParticipantsResponse,
	UpdateProjectPayload,
} from "@/types/project";
import type { Reimbursement } from "@/types/reimbursement";

const BASE_URL = import.meta.env.VITE_API_URL;

// ── Project context type ──────────────────────────────────────────────────────

type ProjectContextType = {
	isLoading: boolean;
	error: string | null;
	errorCode: number | null;
	project: IProject | null;
	budgetSummary: BudgetSummary | null;
	reimbursements: Reimbursement[];
	getProjectById: (projectId: number) => void;
	updateProjectById: (
		projectId: number,
		data: UpdateProjectPayload,
	) => Promise<void>;
	updateProjectParticipantsById: (
		projectId: number,
		data: IParticipant[],
	) => Promise<UpdateProjectParticipantsResponse>;
	// Re-fetche le budget et la balance sans recharger le projet complet.
	// À appeler après toute mutation qui affecte les montants (opération, modification budget).
	refreshBudget: (projectId: number) => Promise<void>;
	isHydrating: boolean;
};

// ── Project context creation ──────────────────────────────────────────────────

export const ProjectContext = createContext<ProjectContextType | undefined>(
	undefined,
);

// ── Project provider ──────────────────────────────────────────────────────────

type ProjectProviderProps = {
	children: React.ReactNode;
};

export function ProjectProvider({ children }: ProjectProviderProps) {
	const [project, setProject] = useState<IProject | null>(null);
	const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(
		null,
	);
	const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [errorCode, setErrorCode] = useState<number | null>(null);

	// Re-fetche uniquement le résumé budget et les remboursements.
	// Évite de recharger le projet entier quand seuls les montants ont changé.
	const refreshBudget = useCallback(async (projectId: number) => {
		try {
			const [budgetData, balanceData] = await Promise.all([
				apiGetBudgets(projectId),
				apiGetBalance(projectId),
			]);
			setBudgetSummary(budgetData);
			setReimbursements(balanceData);
		} catch {
			toast.error("Impossible de charger le budget et la balance");
		}
	}, []);

	const getProjectById = useCallback(async (projectId: number) => {
		const token = localStorage.getItem("token");
		setIsLoading(true);
		try {
			// TODO: replace with apiGetProjectById
			const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!response.ok) {
				setErrorCode(response.status);
				return;
			}
			const data = await response.json();
			setProject(data.project);
			// Utilise refreshBudget pour éviter de dupliquer la logique de fetch budget/balance
			// await refreshBudget(projectId);
			setError(null);
			setErrorCode(null);
		} catch (err: unknown) {
			setProject(null);
			setBudgetSummary(null);
			setReimbursements([]);
			setError(
				err instanceof Error
					? err.message
					: `Error fetching project: ${projectId}`,
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateProjectById = useCallback(
		async (projectId: number, data: UpdateProjectPayload) => {
			try {
				const response = await apiUpdateProject(projectId, data);
				// Update project in context with the response data.
				// If deleteBudget was requested, explicitly set budget to null
				// so the Overview tab re-renders without the budget immediately.
				setProject((prev) => ({
					...prev,
					...response.projectUpdate.project,
					budget: data.deleteBudget ? null : response.projectUpdate.budget,
				}));
			} catch (error) {
				throw error;
			}
		},
		[],
	);

	const [isHydrating, setIsHydrating] = useState(false);
	const updateProjectParticipantsById = useCallback(
		async (
			projectId: number,
			data: IParticipant[],
		): Promise<UpdateProjectParticipantsResponse> => {
			try {
				setIsHydrating(true);
				const response = await apiUpdateParticipantsProject(projectId, data);

				setProject((prev) =>
					prev
						? {
								...prev,
								projectParticipants: response.map((r) => ({
									id: r.participantId,
									participant: r.participant,
								})),
							}
						: prev,
				);
				return response;
			} finally {
				setIsHydrating(false);
			}
		},
		[],
	);

	const value = {
		project,
		budgetSummary,
		reimbursements,
		isLoading,
		error,
		errorCode,
		getProjectById,
		updateProjectById,
		updateProjectParticipantsById,
		refreshBudget,
		isHydrating,
	};

	return (
		<ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
	);
}

// ── Custom hook ───────────────────────────────────────────────────────────────

export function useProject() {
	const context = useContext(ProjectContext);
	if (!context) {
		throw new Error("useProject must be used within a ProjectProvider");
	}
	return context;
}
