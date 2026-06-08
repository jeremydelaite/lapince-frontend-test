import { Bell, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { ParticipantStack } from "@/components/common/ParticipantStack";
import { BudgetProgress } from "@/components/projects/BudgetProgress";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import type { IDashboardProject } from "@/types/project";

const typeToIcon = {
	Voyage: "plane",
	Maison_Coloc: "home",
	Anniversaire: "cake",
	Repas_Sortie: "utensils",
	Pro_Travail: "briefcase",
	Autre: "folder",
} as const;

// Formats ISO date to relative string
function formatDate(iso: string): string {
	const diff = Date.now() - new Date(iso).getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 60) return `mis à jour il y a ${minutes} min`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `mis à jour il y a ${hours} h`;
	const days = Math.floor(hours / 24);
	return `mis à jour il y a ${days} jour${days > 1 ? "s" : ""}`;
}

type ProjectRowProps = {
	project: IDashboardProject;
};

export function ProjectRow({ project }: ProjectRowProps) {
	const icon = typeToIcon[project.type as keyof typeof typeToIcon] ?? "folder";
	const spent = project.budget?.spent ?? 0;
	const limit = project.budget?.limit ?? 0;
	const percent =
		limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
	const alertsCount = project.budget?.unreadAlertsCount ?? 0;
	const navigate = useNavigate();

	return (
		<tr
			className="cursor-pointer transition hover:bg-muted/60"
			onClick={() => navigate(`/project/${project.id}`)}
		>
			<td className="px-6 py-4">
				<ProjectDetails
					name={project.name}
					expensesCount={project.operationsCount}
					updatedAt={formatDate(project.updatedAt)}
					icon={icon}
				/>
			</td>

			<td className="hidden px-6 py-4 md:table-cell">
				<ParticipantStack
					participants={project.participants.map((p) => ({
						participant: { id: p.id, name: p.name, appUser: null },
					}))}
				/>
			</td>

			<td className="hidden px-6 py-4 lg:table-cell">
				{project.budget ? (
					<BudgetProgress
						spent={`${spent.toLocaleString("fr-FR")} €`}
						budget={`${limit.toLocaleString("fr-FR")} €`}
						percent={percent}
					/>
				) : (
					<span className="tex-sm text-muted-foreground">-</span>
				)}
			</td>

			<td className="hidden px-6 py-4 text-center sm:table-cell">
				{alertsCount > 0 ? (
					<span className="relative inline-flex items-center justify-center">
						<Bell className="size-4 text-muted-foreground" />

						<span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
							{alertsCount}
						</span>
					</span>
				) : (
					<span className="text-sm text-muted-foreground">—</span>
				)}
			</td>

			<td className="hidden px-6 py-4 text-right sm:table-cell">
				{project.userBalance !== null ? (
					<span
						className={`text-sm font-medium ${project.userBalance >= 0 ? "text-green-600" : "text-destructive"}`}
					>
						{project.userBalance >= 0 ? "+" : ""}
						{project.userBalance.toLocaleString("fr-FR", {
							style: "currency",
							currency: "EUR",
						})}
					</span>
				) : (
					<span className="text-sm font-medium text-muted-foreground">—</span>
				)}
			</td>

			<td className="px-4 py-4 text-muted-foreground">
				<ChevronRight className="size-4" />
			</td>
		</tr>
	);
}
