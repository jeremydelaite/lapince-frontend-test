export default interface IProject {
	id: number;
	appUserId: number;
	name: string;
	description?: string;
	isArchived: boolean;
	projectParticipants: IProjectParticipants[];
	budget: IBudget | null;
	type: ProjectType;
}

export interface IProjectParticipants {
	id: number;
	participant: IParticipant;
}

export interface IParticipant {
	id?: number;
	tempId?: string;
	appUser: IAppUser | null;
	name: string;
}

export interface IAppUser {
	id: number;
}

interface IBudget {
	id?: number;
	amount: number;
	limitCriteria: number;
}

export type UpdateProjectPayload = {
	name?: string;
	description?: string;
	type?: ProjectType;
	isArchived?: boolean;
	budget?: {
		id?: number;
		amount?: number;
		limitCriteria?: number;
	};
	participants?: IParticipant[];
	deleteBudget?: boolean;
};

export type UpdateProjectResponse = {
	projectUpdate: {
		project: IProject;
		budget: {
			amount: number;
			limitCriteria: number;
		};
	};
};

export type ProjectType =
	| "Voyage"
	| "Maison_Coloc"
	| "Anniversaire"
	| "Repas_Sortie"
	| "Pro_Travail"
	| "Autre";

export type UpdateProjectParticipantsResponse = IProjectParticipantsResponse[];

interface IProjectParticipantsResponse {
	projectId: number;
	participantId: number;
	participant: IParticipant;
}

// DASHBOARD
export interface IDashboardParticipant {
	id: number;
	name: string;
	appUserId: number | null;
}

export interface IDashboardBudget {
	limit: number;
	limitCriteria: number;
	spent: number;
	unreadAlertsCount: number;
}

export interface IDashboardProject {
	id: number;
	name: string;
	type: string;
	updatedAt: string;
	operationsCount: number;
	participants: IDashboardParticipant[];
	budget: IDashboardBudget | null;
	userBalance: number | null;
	isArchived: boolean;
}

export interface IProjectsDashboardResponse {
	projects: IDashboardProject[];
	nextCursor: number | null;
	hasMore: boolean;
	total: number;
}

export type CreateProjectPayload = {
	name: string;
	description?: string;
	type?: string;
	budget?: {
		amount: number;
		alertEnabled: boolean;
		limitCriteria: number;
	};
	participants?: { name: string; isMe?: boolean }[];
};
