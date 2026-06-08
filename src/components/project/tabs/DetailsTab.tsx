import { CircleFadingArrowUpIcon, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useProject } from "@/context/ProjectContext";
import type { IParticipant, UpdateProjectPayload } from "@/types/project";
import { ParticipantsCard } from "../ParticipantsCard";
import { ProjectDetailsForm } from "../ProjectDetailsForm";

export function DetailsTab() {
	const params = useParams();
	const projectId = Number(params.id);

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

	// Local state dedicated to participants editing
	const [participantsFormData, setParticipantsFormData] = useState<
		IParticipant[]
	>([]);

	// To replace useEffect([project]), and initialize it only at first loading
	const [isInitialized, setIsInitialized] = useState(false);
	useEffect(() => {
		if (!project || isInitialized) return;

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
		setIsInitialized(true);
	}, [project, isInitialized]); // Runs every time project changes, or isInitialized is true

	function handleClickDetailsForm() {
		// If user is already editing and clicks again,
		// save the modified data before leaving edit mode
		if (isEditingDetails) {
			updateProjectById(projectId, formData);
		}

		// Toggle edit mode on/off
		setIsEditingDetails(!isEditingDetails);
	}

	async function handleClickParticipantsForm() {
		// Same logic as details section:
		if (isEditingParticipants) {
			// Capturer une snapshot stable avant tout await
			const snapshot = [...participantsFormData];

			try {
				const response = await updateProjectParticipantsById(
					projectId,
					snapshot,
				);

				// Reconstruire depuis la réponse API
				const updated = response
					.map((r) => r.participant)
					.filter((p): p is IParticipant => p !== undefined);

				// Resync explicit from API answer, not from project
				setParticipantsFormData(updated);
			} catch (err) {
				console.error("Erreur PATCH participants :", err);
				// Restaurer le snapshot en cas d'échec
				setParticipantsFormData(snapshot);
				return; // Ne pas quitter le mode édition si erreur
			}
		}
		setIsEditingParticipants((prev) => !prev);
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
					className={`w-full border-dashed ${isEditingDetails && "bg-yellow-400"}`}
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
					className={`w-full border-dashed ${isEditingParticipants && "bg-yellow-400"}`}
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
			</div>
		</div>
	);
}
