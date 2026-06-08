// Shape of a single category spending returned by GET /api/projects/:id/budgets
export type CategorySpending = {
	categoryId: number;
	categoryName: string;
	color: string;
	spent: number;
};

// Shape of the full response of GET /api/projects/:id/budgets
// totalLimit and alertThreshold can be null if no budget is defined for the project
export type BudgetSummary = {
	totalSpent: number;
	totalLimit: number | null;
	alertThreshold: number | null;
	spentByCategory: CategorySpending[];
};
