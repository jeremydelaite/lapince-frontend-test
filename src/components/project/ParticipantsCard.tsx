import { Plus, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IParticipant } from "@/types/project";

// Props received from the parent component (DetailsTab)
type ProjectParticipantsFormProps = {
	participantsFormData: IParticipant[];
	setParticipantsFormData: Dispatch<SetStateAction<IParticipant[]>>;
	isEditingParticipants: boolean;
};

export function ParticipantsCard({
	participantsFormData,
	setParticipantsFormData,
	isEditingParticipants,
}: ProjectParticipantsFormProps) {
	// Removes a participant from the local state
	// The participant is identified here by its position in the array
	function handleRemoveParticipant(index: number) {
		setParticipantsFormData((prev) =>
			// Keep all items except the one at the selected index
			prev.filter((_, i) => i !== index),
		);
	}

	// Adds a new empty participant to the local state
	function handleAddParticipant() {
		setParticipantsFormData((prev) => [
			// Keep existing participants
			...prev,

			// Add a new empty participant at the end
			{
				// An id just used in front
				tempId: crypto.randomUUID(),
				// New participants are not linked to an app user yet
				appUser: null,
				// Empty name waiting for user input
				name: "",
			},
		]);
	}

	return (
		<div className="space-y-3">
			<div
				className={`space-y-5 rounded-lg border bg-card p-6 ${
					isEditingParticipants ? "border-amber-400" : "border-border"
				}`}
			>
				{/* Header section */}
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-sm font-medium">Participants</h2>

					{/* Add participant button */}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleAddParticipant}
						disabled={!isEditingParticipants}
					>
						<Plus className="size-4" />
						Ajouter
					</Button>
				</div>

				{/* Participants list */}
				<ul className="space-y-2">
					{participantsFormData.map((participant, index) => (
						<li
							key={participant.id ?? participant.tempId}
							className="flex items-center gap-2"
						>
							<Input
								// Controlled input:
								// value always comes from React state
								value={participant.name ?? ""}
								onChange={(e) =>
									setParticipantsFormData((prev) =>
										prev.map((p, i) =>
											i === index ? { ...p, name: e.target.value } : p,
										),
									)
								}
								className="flex-1"
								disabled={!isEditingParticipants}
							/>

							{/* Delete participant button */}
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:text-destructive"
								onClick={() => handleRemoveParticipant(index)}
							>
								<Trash2 className="size-4" />
							</Button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
