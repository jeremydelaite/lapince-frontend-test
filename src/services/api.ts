import { toast } from "sonner";
import type {
	CategoriesResponse,
	ICategories,
	LoginResponse,
	UserResponse,
} from "@/types";
import type { Alert, UpdateAlertPayload } from "@/types/alert";
import type { BudgetSummary } from "@/types/budget";
import type {
	CreateOperationPayload,
	IOperation,
	IOperationsResponse,
} from "@/types/operations";
import type {
	CreateProjectPayload,
	IDashboardProject,
	IParticipant,
	IProjectsDashboardResponse,
	UpdateProjectParticipantsResponse,
	UpdateProjectPayload,
	UpdateProjectResponse,
} from "@/types/project";
import type { Reimbursement } from "@/types/reimbursement";

const BASE_URL = import.meta.env.VITE_API_URL;

// ── Payloads ────────────────────────────────────────────────────────────────

// Data sent to POST /api/auth/register
export type RegisterPayload = {
	name: string;
	email: string;
	password: string;
};

// Data sent to POST /api/auth/login
export type LoginPayload = {
	email: string;
	password: string;
};

// ── Helpers ─────────────────────────────────────────────────────────────────

// Returns the JWT stored in localStorage (or null if not logged in)
function getToken(): string | null {
	return localStorage.getItem("token");
}

// Builds fetch headers, with Authorization if needed
function buildHeaders(withAuth = false): HeadersInit {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (withAuth) {
		const token = getToken();
		if (token) headers.Authorization = `Bearer ${token}`;
	}
	return headers;
}

async function handleResponse<T>(
	res: Response,
	skipUnauthorized: boolean = false,
): Promise<T> {
	if (res.status === 401 && !skipUnauthorized) {
		// Token expired — notify the app to log out
		toast.error("Votre session a expiré. Veuillez vous reconnecter.");
		window.dispatchEvent(new Event("auth:unauthorized"));
	}

	if (!res.ok) {
		switch (res.status) {
			case 429:
				toast.error(
					"Vous avez effectué trop de requêtes. Réessayez dans quelques minutes.",
				);
				break;

			case 500:
				toast.error(
					"Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
				);
				break;
		}

		const error = await res.json().catch(() => ({ error: res.statusText }));
		throw error;
	}
	if (res.status === 204) {
		return undefined as T;
	}
	return res.json();
}

// Throws 204 if deletion is done
async function handleDeleteResponse(res: Response): Promise<number> {
	if (res.status === 401) {
		toast.error("Votre session a expiré. Veuillez vous reconnecter.");
		window.dispatchEvent(new Event("auth:unauthorized"));
	}

	if (!res.ok) {
		switch (res.status) {
			case 429:
				toast.error(
					"Vous avez effectué trop de requêtes. Réessayez dans quelques minutes.",
				);
				break;

			case 500:
				toast.error(
					"Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
				);
				break;
		}

		const error = await res.json().catch(() => ({
			error: res.statusText,
		}));

		throw error;
	}

	if (res.status === 204) {
		return res.status;
	}
	return res.json();
}

// ── Auth endpoints ───────────────────────────────────────────────────────────

export async function apiRegister(
	payload: RegisterPayload,
): Promise<UserResponse> {
	const res = await fetch(`${BASE_URL}/api/auth/register`, {
		method: "POST",
		headers: buildHeaders(),
		body: JSON.stringify(payload),
	});
	return handleResponse(res);
}

export async function apiLogin(payload: LoginPayload): Promise<LoginResponse> {
	const res = await fetch(`${BASE_URL}/api/auth/login`, {
		method: "POST",
		headers: buildHeaders(),
		body: JSON.stringify(payload),
	});
	return handleResponse(res, true);
}

export async function apiLogout(): Promise<void> {
	const res = await fetch(`${BASE_URL}/api/auth/logout`, {
		method: "POST",
		headers: buildHeaders(true),
	});
	return handleResponse(res);
}

export async function apiMe(): Promise<UserResponse> {
	const res = await fetch(`${BASE_URL}/api/auth/me`, {
		method: "GET",
		headers: buildHeaders(true),
	});
	return handleResponse(res);
}

// ── Projects endpoints ───────────────────────────────────────────────────────

export async function apiGetProjects(
	cursor?: number,
): Promise<IProjectsDashboardResponse> {
	const url = cursor
		? `${BASE_URL}/api/projects?cursor=${cursor}`
		: `${BASE_URL}/api/projects`;

	const res = await fetch(url, {
		method: "GET",
		headers: buildHeaders(true),
	});
	return handleResponse(res);
}

export async function apiCreateProject(
	payload: CreateProjectPayload,
): Promise<{ project: IDashboardProject }> {
	const res = await fetch(`${BASE_URL}/api/projects`, {
		method: "POST",
		headers: buildHeaders(true),
		body: JSON.stringify(payload),
	});
	return handleResponse(res);
}

export async function apiUpdateProject(
	projectId: number,
	payload: UpdateProjectPayload,
): Promise<UpdateProjectResponse> {
	const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
		method: "PATCH",
		headers: buildHeaders(true),
		body: JSON.stringify(payload),
	});
	return handleResponse<UpdateProjectResponse>(res);
}

export async function apiUpdateParticipantsProject(
	projectId: number,
	payload: IParticipant[],
): Promise<UpdateProjectParticipantsResponse> {
	const res = await fetch(
		`${BASE_URL}/api/projects/${projectId}/participants`,
		{
			method: "PATCH",
			headers: buildHeaders(true),
			body: JSON.stringify(payload),
		},
	);
	return handleResponse<UpdateProjectParticipantsResponse>(res);
}

export async function apiDeleteProject(projectId: number): Promise<number> {
	const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
		method: "DELETE",
		headers: buildHeaders(true),
	});
	return handleDeleteResponse(res);
}

// ── Budget endpoints ─────────────────────────────────────────────────────────

export async function apiGetBudgets(projectId: number): Promise<BudgetSummary> {
	const res = await fetch(`${BASE_URL}/api/projects/${projectId}/budgets`, {
		method: "GET",
		headers: buildHeaders(true),
	});
	return handleResponse<BudgetSummary>(res);
}

// ── Balance endpoints ────────────────────────────────────────────────────────

export async function apiGetBalance(
	projectId: number,
): Promise<Reimbursement[]> {
	const res = await fetch(`${BASE_URL}/api/projects/${projectId}/balance`, {
		method: "GET",
		headers: buildHeaders(true),
	});
	return handleResponse<Reimbursement[]>(res);
}

// ── Category endpoints ───────────────────────────────────────────────────────────

export async function apiGetCategories(): Promise<ICategories[]> {
	const res = await fetch(`${BASE_URL}/api/categories`, {
		method: "GET",
		headers: buildHeaders(false),
	});
	const data = await handleResponse<CategoriesResponse>(res);
	return data.categories;
}

// ── Operation endpoints ───────────────────────────────────────────────────────────

export async function apiGetOperations(
	projectId: number,
): Promise<IOperation[]> {
	const res = await fetch(`${BASE_URL}/api/projects/${projectId}/operations`, {
		method: "GET",
		headers: buildHeaders(true),
	});
	const data = await handleResponse<IOperationsResponse>(res);
	return data.operations;
}

export async function apiDeleteOperation(
	operationId: number,
	projectId: number,
): Promise<void> {
	const res = await fetch(
		`${BASE_URL}/api/projects/${projectId}/operations/${operationId}`,
		{
			method: "DELETE",
			headers: buildHeaders(true),
		},
	);
	return handleResponse<void>(res);
}

export async function apiCreateOperation(
	operationPayload: CreateOperationPayload,
): Promise<IOperation> {
	const projectId = operationPayload.projectId;
	const res = await fetch(`${BASE_URL}/api/projects/${projectId}/operations`, {
		method: "POST",
		headers: buildHeaders(true),
		body: JSON.stringify(operationPayload),
	});

	const data = await handleResponse<{ operation: IOperation }>(res);
	return data.operation;
}

export async function apiUpdateOperation(
	operationId: number,
	operationPayload: CreateOperationPayload,
): Promise<IOperation> {
	const projectId = operationPayload.projectId;
	const res = await fetch(
		`${BASE_URL}/api/projects/${projectId}/operations/${operationId}`,
		{
			method: "PATCH",
			headers: buildHeaders(true),
			body: JSON.stringify(operationPayload),
		},
	);
	const data = await handleResponse<{ operation: IOperation }>(res);
	return data.operation;
}
// ── Global balance endpoint ──────────────────────────────────────────────────

export type GlobalBalance = {
	toDo: number;
	toReceive: number;
	netBalance: number;
};

export async function apiGetGlobalBalance(): Promise<GlobalBalance> {
	const res = await fetch(`${BASE_URL}/api/balance`, {
		method: "GET",
		headers: buildHeaders(true),
	});
	return handleResponse<GlobalBalance>(res);
}

// ── Alert endpoints ──────────────────────────────────────────────────────────

export async function apiGetAlerts(): Promise<Alert[]> {
	const res = await fetch(`${BASE_URL}/api/alertes`, {
		method: "GET",
		headers: buildHeaders(true),
	});
	const data = await handleResponse<{ alerts: Alert[] }>(res);
	return data.alerts;
}

export async function apiGetProjectAlerts(projectId: number): Promise<Alert[]> {
	const res = await fetch(`${BASE_URL}/api/projects/${projectId}/alertes`, {
		method: "GET",
		headers: buildHeaders(true),
	});
	const data = await handleResponse<{ alerts: Alert[] }>(res);
	return data.alerts;
}

export async function apiMarkAlertAsRead(
	alertId: number,
	payload: UpdateAlertPayload,
): Promise<Alert> {
	const res = await fetch(`${BASE_URL}/api/alertes/${alertId}`, {
		method: "PATCH",
		headers: buildHeaders(true),
		body: JSON.stringify(payload),
	});
	return handleResponse<Alert>(res);
}
