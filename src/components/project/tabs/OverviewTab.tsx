import { useEffect } from "react";
import { useParams } from "react-router";
import { BudgetOverview } from "@/components/project/BudgetOverview";
import { SpendingByCategory } from "@/components/project/SpendingByCategory";
import { useProject } from "@/context/ProjectContext";
import { BalanceCard } from "../BalanceCard";

type OverviewTabProps = {
	onCategoryClick: (categoryId: number) => void;
};

export function OverviewTab({ onCategoryClick }: OverviewTabProps) {
	const params = useParams();
	const projectId = Number(params.id);
	// refreshBudget re-fetche uniquement budget + balance sans recharger le projet entier
	const { refreshBudget } = useProject();

	useEffect(() => {
		refreshBudget(projectId);
	}, [projectId, refreshBudget]);
	return (
		<div className="flex flex-col gap-6 md:flex-row">
			<div className="flex-1 space-y-6">
				<BudgetOverview />
				<SpendingByCategory onCategoryClick={onCategoryClick} />
			</div>
			<div className="flex-1">
				<BalanceCard />
			</div>
		</div>
	);
}
