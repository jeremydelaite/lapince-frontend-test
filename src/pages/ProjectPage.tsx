import { useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { ConnectedHeader } from "@/components/common/ConnectedHeader";
import { ProjectHeading } from "@/components/project/ProjectHeading";
import { ProjectTabs } from "@/components/project/ProjectTabs";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";

export function ProjectPage() {
	const params = useParams();
	const projectId = Number(params.id);
	const {
		isLoading: isProjectLoading,
		getProjectById,
		project,
		errorCode,
	} = useProject();
	const { user, isLoading: isAuthLoading } = useAuth();

	useEffect(() => {
		if (user) {
			getProjectById(projectId);
		}
	}, [user, projectId, getProjectById]);

	useEffect(() => {
		if (project) {
			document.title = `La Pince – ${project.name}`;
		}
	}, [project]);

	if (isAuthLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (errorCode === 403) {
		return <Navigate to="/forbidden" replace />;
	}

	if (errorCode === 404) {
		return <Navigate to="/not-found" replace />;
	}

	if (isProjectLoading || !project) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<ConnectedHeader />
			<main className="mx-auto max-w-5xl px-6 py-10">
				<ProjectHeading project={project} />
				<ProjectTabs projectId={projectId} />
			</main>
		</>
	);
}
