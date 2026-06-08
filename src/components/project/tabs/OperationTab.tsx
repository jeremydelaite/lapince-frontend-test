import { useCallback, useEffect, useState } from "react";
import { OperationDialog } from "@/components/project/OperationDialog";
import { OperationsTable } from "@/components/project/OperationsTable";
import { TableFilters } from "@/components/project/TableFilters";
import { useCategories } from "@/context/CategoriesContext";
import { useProject } from "@/context/ProjectContext";
import { apiGetOperations } from "@/services/api";
import type { IOperation, IOperationDialogState } from "@/types/operations";
import { getAvatarColor } from "@/utils/avatarColors";

export function OperationTab() {
	const { project } = useProject();
	const { categories } = useCategories();

	const [operations, setOperations] = useState<IOperation[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [activeFilter, setActiveFilter] = useState<number | null>(null);

	const [selectedOperation, setSelectedOperation] = useState<IOperation | null>(
		null,
	);

	const [operationDialogState, setOperationDialogState] =
		useState<IOperationDialogState | null>(null);

	const [isOperationDialogOpen, setIsOperationDialogOpen] = useState(false);

	// ── Chargement des opérations ─────────────────────────────

	const loadOperations = useCallback(async () => {
		if (!project?.id) return;
		setIsLoading(true);
		try {
			const data = await apiGetOperations(project.id);
			setOperations(data);
		} finally {
			setIsLoading(false);
		}
	}, [project?.id]);

	useEffect(() => {
		loadOperations();
	}, [loadOperations]);

	// ── Création des catégories de filtre ──────────────────────────────────────

	// ── Total opérations ──────────────────────────────────────

	const buildDialogParticipants = useCallback(
		(operation: IOperation | null = null) => {
			if (!project) return [];
			return project.projectParticipants.map((projectParticipant) => {
				const participant = projectParticipant.participant;
				const operationParticipant = operation?.operationParticipants.find(
					(opParticipant) => opParticipant.participant.id === participant.id,
				);
				return {
					participantId: participant.id,
					name: participant.name,
					initials: participant.name.slice(0, 2).toUpperCase(),
					avatarColor: getAvatarColor(participant.name),
					isSelected: Boolean(operationParticipant),
					repartitionAmount: operationParticipant?.repartitionAmount
						? String(operationParticipant.repartitionAmount)
						: "",
				};
			});
		},
		[project],
	);

	// ── Préparation modale édition ────────────────────────────

	useEffect(() => {
		if (!selectedOperation || !project) return;

		setOperationDialogState({
			mode: "edit",
			projectId: project.id,
			operationId: selectedOperation.id,
			name: selectedOperation.name,
			amount: selectedOperation.amount,
			categoryId: selectedOperation.categoryId,
			date: selectedOperation.date.slice(0, 10),
			payerParticipantId: selectedOperation.payerParticipantId,
			participants: buildDialogParticipants(selectedOperation),
		});
	}, [selectedOperation, project, buildDialogParticipants]);

	// ── Ouverture création ────────────────────────────────────

	function openCreateOperationDialog() {
		if (!project) return;

		setSelectedOperation(null);

		setOperationDialogState({
			mode: "create",
			projectId: project.id,
			operationId: null,
			name: "",
			amount: 0,
			categoryId: undefined,
			date: new Date().toISOString().slice(0, 10),
			payerParticipantId: undefined,
			participants: buildDialogParticipants(),
		});

		setIsOperationDialogOpen(true);
	}

	// ── Filtre (préparation future) ───────────────────────────

	const filteredOperations = activeFilter
		? operations.filter((operation) => operation.categoryId === activeFilter)
		: operations;

	return (
		<div className="space-y-4">
			<TableFilters
				options={categories}
				activeValue={activeFilter}
				onValueChange={setActiveFilter}
				onActionClick={openCreateOperationDialog}
			/>

			<OperationsTable
				operations={filteredOperations}
				isLoading={isLoading}
				error={error}
				setSelectedOperation={setSelectedOperation}
				setIsOperationDialogOpen={setIsOperationDialogOpen}
			/>

			<OperationDialog
				open={isOperationDialogOpen}
				onOpenChange={setIsOperationDialogOpen}
				operationDialogState={operationDialogState}
				setOperationDialogState={setOperationDialogState}
				onOperationCreated={loadOperations}
			/>
		</div>
	);
}
