import { useState } from "react";
import { OperationDialog } from "@/components/project/OperationDialog";
import { TableFilters } from "@/components/project/TableFilters";

import { OperationsTable } from "../OperationsTable";

export function OperationTab() {
	const [activeFilter, setActiveFilter] = useState("all");
	const [isOperationDialogOpen, setIsOperationDialogOpen] = useState(false);

	return (
		<div className="space-y-4">
			<TableFilters
				options={[
					{ value: "all", label: "Toutes", count: 12 },
					{ value: "housing", label: "Hébergement", count: 3 },
					{ value: "transport", label: "Transport", count: 2 },
					{ value: "food", label: "Restauration", count: 4 },
					{ value: "activities", label: "Activités", count: 2 },
				]}
				activeValue={activeFilter}
				onValueChange={setActiveFilter}
				actionLabel="Nouvelle opération"
				onActionClick={() => setIsOperationDialogOpen(true)}
			/>

			<OperationsTable />

			<OperationDialog
				open={isOperationDialogOpen}
				onOpenChange={setIsOperationDialogOpen}
			/>
		</div>
	);
}
