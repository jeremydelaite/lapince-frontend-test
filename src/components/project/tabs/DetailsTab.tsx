import { CircleFadingArrowUpIcon, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useProject } from "@/context/ProjectContext";
import { apiDeleteProject } from "@/services/api";
import type { IParticipant, UpdateProjectPayload } from "@/types/project";
import { ParticipantsCard } from "../ParticipantsCard";
import { ProjectDetailsForm } from "../ProjectDetailsForm";

type DetailsTabProps = {
	onBudgetUpdated: () => void;
};

export function DetailsTab({ onBudgetUpdated }: DetailsTabProps) {
	const params = useParams();
	const projectId = Number(params.id);
	const navigate = useNavigate();

	// Controls to check if inputs are editable
	const [isEditingDetails, setIsEditingDetails] = useState(false);
	const [isEditingParticipants, setIsEditingParticipants] = useState(false);

	// Access current project data and update function from context
	const { updateProjectById, updateProjectParticipantsById, project } =
		useProject();

	// Local state used by ProjectDetailsForm
	// Keeps a copy of project data while user edits it
	const [formData, setFormData] = useState<UpdateProjectPayload>({
		name: "",
		description: "",
		type: undefined,
	});

	const isArchived = project?.isArchived ?? false;

	// Local state dedicated to participants editing
	const [participantsFormData, setParticipantsFormData] = useState<
		IParticipant[]
	>([]);

	// Synchronize formData with project context on every project change.
	// This ensures the form always reflects the latest server state,
	// including after a budget deletion (project.budget becomes null → formData.budget becomes undefined).
	useEffect(() => {
		if (!project) return;

		// Synchronize project details from API/context into local form state
		// This allows controlled inputs to display current values
		setFormData({
			name: project.name,
			description: project.description,
			type: project.type,
			budget: project.budget
				? {
						id: project.budget.id,
						amount: Number(project.budget.amount),
						limitCriteria: Number(project.budget.limitCriteria),
					}
				: undefined,
		});

		// Extract participants from projectParticipants relation
		// projectParticipants contains the junction table data,
		// but we only need the participant object itself in a clean array
		const participants = project.projectParticipants
			.map((pp) => pp.participant)
			.filter((p): p is IParticipant => p !== undefined);

		setParticipantsFormData(participants);
	}, [project]); // Re-runs whenever project context changes (e.g. after save, budget deletion)
		
	async function handleClickDetailsForm() {
    if (isArchived) {
			toast.warning("Veuillez dé-archiver le projet pour pouvoir le modifier");
			return;
		}
		// Build the payload from current form state.
		// If the project had a budget and the user disabled the switch (formData.budget is now undefined),
		// add deleteBudget: true to signal the backend to remove it.
		if (isEditingDetails) {
			const hadBudget = !!project?.budget;
			const nowHasBudget = !!formData.budget;

			const payload: UpdateProjectPayload = { ...formData };
			if (hadBudget && !nowHasBudget) {
				payload.deleteBudget = true;
			}
			await updateProjectById(projectId, payload);
			onBudgetUpdated();
		}

		// Toggle edit mode on/off
		setIsEditingDetails(!isEditingDetails);
	}

	async function handleClickParticipantsForm() {
		if (isArchived) {
			toast.warning("Veuillez dé-archiver le projet pour pouvoir le modifier");
			return;
		}
		if (isEditingParticipants) {
			if (!project) {
				return;
			}
			// Snapshot depuis le context — état serveur stable, pas l'état local édité
			const snapshot = project.projectParticipants
				.map((pp) => pp.participant)
				.filter((p): p is IParticipant => p !== undefined);

			try {
				const response = await updateProjectParticipantsById(
					projectId,
					participantsFormData,
				);
				const updated = response
					.map((r) => r.participant)
					.filter((p): p is IParticipant => p !== undefined);

				setParticipantsFormData(updated);
			} catch (err) {
				toast.error(
					"Impossible de supprimer le participant s'il a des opérations liées",
				);
				console.error("Error PATCH participants :", err);
				// Restaure l'état serveur, pas l'état local édité
				setParticipantsFormData(snapshot);
				return;
			}
		}
		setIsEditingParticipants((prev) => !prev);
	}

	async function handleDelete() {
		try {
			const response = await apiDeleteProject(projectId);
			if (response === 204) {
				toast.success("Projet supprimé");
				navigate("/projects");
			}
		} catch (err) {
			toast.error("Erreur : Impossible de supprimer le projet");
			console.error("Error DELETE project :", err);
			return;
		}
	}

	return (
		<div className="flex flex-col gap-6 md:flex-row">
			{/* =========================
			    PROJECT DETAILS SECTION
			   ========================= */}
			<div className="flex-1 space-y-6">
				<ProjectDetailsForm
					// Current values displayed in the form
					formData={formData}
					// Allows child component to update parent state
					setFormData={setFormData}
					// Enables/disables inputs
					isEditingDetails={isEditingDetails}
				/>

				<Button
					type="button"
					variant="outline"
					className={`w-full border-dashed ${isEditingDetails ? "bg-yellow-400" : ""} ${isArchived ? "opacity-50" : ""}`}
					onClick={handleClickDetailsForm}
				>
					{isEditingDetails ? (
						<>
							<Save className="size-4" />
							Sauvegarder
						</>
					) : (
						<>
							<CircleFadingArrowUpIcon className="size-4" />
							Modifier
						</>
					)}
				</Button>
			</div>

			{/* =========================
			    PARTICIPANTS SECTION
			   ========================= */}
			<div className="flex-1 space-y-6">
				<ParticipantsCard
					// Local participants state
					participantsFormData={participantsFormData}
					// Allows ParticipantsCard to modify participants list
					setParticipantsFormData={setParticipantsFormData}
					// Enables/disables participant inputs
					isEditingParticipants={isEditingParticipants}
				/>

				<Button
					type="button"
					variant="outline"
					className={`w-full border-dashed ${isEditingParticipants ? "bg-yellow-400" : ""} ${isArchived ? "opacity-50" : ""}`}
					onClick={handleClickParticipantsForm}
				>
					{isEditingParticipants ? (
						<>
							<Save className="size-4" />
							Sauvegarder
						</>
					) : (
						<>
							<CircleFadingArrowUpIcon className="size-4" />
							Modifier
						</>
					)}
				</Button>

				{/* =========================
			    DELETE PROJECT BUTTON
			   ========================= */}

				<Dialog>
					<DialogTrigger
						className="w-full border-dashed"
						render={
							<Button
								type="button"
								variant="destructive"
								className="w-full border-dashed"
							/>
						}
					>
						<Trash2 className="size-4" />
						Supprimer le projet
					</DialogTrigger>
					<DialogContent>
						<DialogHeader className="p-3">
							<DialogTitle>
								Êtes-vous sûr de vouloir supprimer ce projet ?
							</DialogTitle>
							<DialogDescription>
								Cette action est irréversible.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose render={<Button variant="outline" />}>
								Annuler
							</DialogClose>

							<Button type="submit" onClick={handleDelete}>
								Supprimer
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
