export default interface IProject {
	id: number;
	appUserId: number;
	name: string;
	description?: string;
	isArchived: boolean;
	projectParticipants: IProjectParticipants[];
	budget: IBudget;
	type: ProjectType;
}

export interface IProjectParticipants {
	id?: number;
	participant?: IParticipant;
}

export interface IParticipant {
	id?: number;
	tempId?: string;
	appUser: IAppUser | null;
	name: string;
}

interface IAppUser {
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

// Initial setup before dynamisation of page
//TODO: Remove it when everythings is setup
export type Project = {
	id: string;
	name: string;
	description: string;
	expensesCount: number;
	updatedAt: string;
	status: ProjectStatus;
	icon: ProjectIcon;
	participants: string[];
	spent: string;
	budget: number;
	budgetPercent: number;
	alertsCount: number;
	balance: string;
	balanceStatus: "negative" | "positive" | "neutral";
};

export type ProjectStatus = "active" | "archived";

export type ProjectIcon = "plane" | "home" | "cake" | "utensils";

export const projects: Project[] = [
	{
		id: "1",
		name: "Week-end à Lisbonne",
		description: "3 jours entre amis",
		expensesCount: 12,
		updatedAt: "mis à jour il y a 2 h",
		status: "active",
		icon: "plane",
		participants: ["SL", "AL", "BO", "CH"],
		spent: "847,50 €",
		budget: 10,
		budgetPercent: 85,
		alertsCount: 1,
		balance: "−45,20 €",
		balanceStatus: "negative",
	},
	{
		id: "2",
		name: "Coloc rue Pasteur",
		description: "Colocation",
		expensesCount: 47,
		updatedAt: "mis à jour hier",
		status: "active",
		icon: "home",
		participants: ["SL", "MA", "JU"],
		spent: "2 340 €",
		budget: 2000,
		budgetPercent: 100,
		alertsCount: 2,
		balance: "+128,40 €",
		balanceStatus: "positive",
	},
	{
		id: "3",
		name: "Anniversaire Léa",
		description: "Organisation anniversaire",
		expensesCount: 4,
		updatedAt: "mis à jour il y a 3 jours",
		status: "active",
		icon: "cake",
		participants: ["SL", "LE", "PA", "+3"],
		spent: "180 €",
		budget: 500,
		budgetPercent: 36,
		alertsCount: 0,
		balance: "Équilibré",
		balanceStatus: "neutral",
	},
];

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
