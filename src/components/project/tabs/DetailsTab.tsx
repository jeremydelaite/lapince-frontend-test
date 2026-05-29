import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticipantsCard } from "../ParticipantsCard";
import { ProjectDetailsForm } from "../ProjectDetailsForm";

export function DetailsTab() {
	return (
		<div className="flex flex-col gap-6 md:flex-row">
			<div className="flex-1 space-y-6">
				<ProjectDetailsForm />
			</div>
			<div className="flex-1">
				<ParticipantsCard />
				{/* TODO: créer un contexte pour partager le state qui gère la modale du projet 
				/Users/w0dr/Oclock/apo/projet-cda-LaPince-frontend/src/components/common/ProjectDialog.tsx*/}
				<Button
					type="button"
					variant="outline"
					className="w-full border-dashed"
				>
					<Plus className="size-4" />
					Modifier
				</Button>
			</div>
		</div>
	);
}
