import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { Switch } from "@/components/ui/switch";
import { useProject } from "@/context/ProjectContext";
import type IProject from "@/types/project";
import { ParticipantStack } from "../common/ParticipantStack";

interface ProjectHeadingProps {
	project: IProject;
}

export function ProjectHeading({ project }: ProjectHeadingProps) {
	const { updateProjectById } = useProject();

	return (
		<div className="mb-8 flex flex-col items-start justify-between sm:flex-row">
			<div className="flex-1">
				<Link
					to="/projects"
					className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" />
					Retour aux projets
				</Link>

				<h1 className="text-2xl font-semibold tracking-tight">
					{project.name}
				</h1>
				<p className="mt-1 text-sm text-muted-foreground mb-4">
					{project.description}
				</p>
			</div>

			<div className="flex-1 flex flex-row-reverse  items-center gap-4 ">
				{/* Archive toggle — sends a PATCH with isArchived to the API */}
				<div className="flex items-center gap-2">
					<Switch
						id="archive-toggle"
						checked={project.isArchived}
						onCheckedChange={(checked) =>
							updateProjectById(project.id, { isArchived: checked })
						}
					/>
					<label htmlFor="archive-toggle">Archivé</label>
				</div>

				<ParticipantStack
					participants={project.projectParticipants}
					size="md"
				/>
			</div>
		</div>
	);
}
