export interface IOperationParticipant {
	isRepartitionAmountCalculated: boolean;
	repartitionAmount: number;
	participant: {
		id: number;
		name: string;
	};
}

export interface IOperation {
	id: number;
	appUserId: number;
	name: string;
	categoryId: number;
	amount: number;
	isAmountCalculated: boolean;
	date: string;
	payerParticipantId: number;
	appUser: {
		id: number;
		name: string;
	};
	operationParticipants: IOperationParticipant[];
}

export interface IOperationsResponse {
	operations: IOperation[];
}

export type OperationDialogMode = "create" | "edit";

export interface IOperationDialogParticipant {
	participantId: number;
	name: string;
	initials: string;
	avatarColor: string;
	isSelected: boolean;
	isRepartitionAmountCalculated: boolean;
	repartitionAmount: string;
}

export interface IOperationDialogState {
	mode: OperationDialogMode;
	projectId: number;
	operationId: number | null;
	name: string;
	amount: string;
	isAmountCalculated: boolean;
	isBalancedAmount: boolean;
	categoryId: number | undefined;
	date: string;
	payerParticipantId: number | undefined;
	participants: IOperationDialogParticipant[];
	hasSelectedParticipant: boolean;
}

export type CreateOperationPayload = {
	name: string;
	amount: number;
	isAmountCalculated: boolean;
	date: string;
	categoryId: number;
	projectId: number;
	payerParticipantId: number;
	operationParticipants: {
		participantId: number;
		isRepartitionAmountCalculated: boolean;
		repartitionAmount: number;
	}[];
};
