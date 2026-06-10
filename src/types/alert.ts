export type Alert = {
	id: number;
	status: "unread" | "read" | "resolved";
	message: string;
	budgetId: number;
	budgetAmount: number;
	projectName: string;
	createdAt: string;
};

export type UpdateAlertPayload = {
	status: "unread" | "read" | "resolved";
};
