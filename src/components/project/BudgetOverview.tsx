import type { LucideIcon } from "lucide-react";
import {
	BedDouble,
	ShoppingBasket,
	Tag,
	Ticket,
	TrainFront,
	Utensils,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

// Front-only map — category name → Lucide icon
const categoryIconMap: Record<string, LucideIcon> = {
	Divers: Tag,
	Restaurants: Utensils,
	Hébergement: BedDouble,
	Transport: TrainFront,
	Courses: ShoppingBasket,
	Loisir: Ticket,
};

export function BudgetOverview() {
	const { budgetSummary } = useProject();

	if (!budgetSummary || budgetSummary.spentByCategory.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-border p-6 text-center">
				<p className="text-sm font-medium">Aucune dépense</p>
				<p className="text-xs text-muted-foreground mt-1">
					La vue d'ensemble apparaîtra ici.
				</p>
			</div>
		);
	}

	const { totalSpent, totalLimit, spentByCategory } = budgetSummary;
	const usedPercent = totalLimit
		? Math.round((totalSpent / totalLimit) * 100)
		: null;

	return (
		<div className="rounded-lg border border-border p-6 mb-6 bg-card">
			<div className="mb-2 flex items-baseline justify-between">
				<div className="flex items-baseline gap-2">
					<span className="text-2xl font-semibold tracking-tight tabular-nums">
						{totalSpent.toLocaleString("fr-FR", {
							style: "currency",
							currency: "EUR",
						})}
					</span>
					{totalLimit && (
						<span className="text-sm text-muted-foreground tabular-nums">
							/{" "}
							{totalLimit.toLocaleString("fr-FR", {
								style: "currency",
								currency: "EUR",
							})}
						</span>
					)}
				</div>
				{usedPercent !== null && (
					<span className="text-xs font-medium text-muted-foreground">
						{usedPercent}% utilisé
					</span>
				)}
			</div>

			<div className="mb-4 flex h-2.5 overflow-hidden rounded-full bg-muted">
				{spentByCategory.map((category) => (
					<div
						key={category.categoryId}
						style={{
							width: `${totalLimit ? (category.spent / totalLimit) * 100 : 0}%`,
							backgroundColor: category.color,
						}}
					/>
				))}
			</div>

			<div className="flex flex-wrap items-center gap-2">
				{spentByCategory.map((category) => {
					// TODO: replace categoryIconMap with category.icon from useCategories() and API is merged

					const Icon = categoryIconMap[category.categoryName] ?? Tag;

					return (
						<span
							key={category.categoryId}
							title={`${category.categoryName} · ${category.spent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`}
							className="flex size-8 cursor-help items-center justify-center rounded-md text-white"
							style={{ backgroundColor: category.color }}
						>
							<Icon className="size-4" />
						</span>
					);
				})}
			</div>
		</div>
	);
}
