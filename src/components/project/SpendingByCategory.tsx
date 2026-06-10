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

type SpendingByCategoryProps = {
	onCategoryClick: (categoryId: number) => void;
};

export function SpendingByCategory({
	onCategoryClick,
}: SpendingByCategoryProps) {
	const { budgetSummary } = useProject();

	if (!budgetSummary || budgetSummary.spentByCategory.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-border p-6 text-center">
				<p className="text-sm font-medium">Aucune catégorie</p>
				<p className="text-xs text-muted-foreground mt-1">
					Les dépenses par catégorie apparaîtront ici.
				</p>
			</div>
		);
	}

	const { spentByCategory } = budgetSummary;

	return (
		<div className="rounded-lg border border-border bg-card p-6">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-sm font-medium">Dépenses par catégorie</h2>
			</div>
			<ul className="space-y-3">
				{spentByCategory.map((category) => {
					const Icon = categoryIconMap[category.categoryName] ?? Tag;
					return (
						<li key={category.categoryId}>
							<button
								type="button"
								onClick={() => onCategoryClick(category.categoryId)}
								className="flex w-full items-center gap-3 text-sm rounded-md hover:bg-muted px-2 py-1 -mx-2 transition-colors cursor-pointer"
							>
								<span
									className="flex size-7 shrink-0 items-center justify-center rounded-md text-white"
									style={{ backgroundColor: category.color }}
								>
									<Icon className="size-3.5" />
								</span>
								<span className="flex-1 text-left">
									{category.categoryName}
								</span>
								<span className="tabular-nums font-medium">
									{category.spent.toLocaleString("fr-FR", {
										style: "currency",
										currency: "EUR",
									})}
								</span>
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
