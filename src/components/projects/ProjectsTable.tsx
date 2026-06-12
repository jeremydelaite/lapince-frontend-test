import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ProjectRow } from "@/components/projects/ProjectRow";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useProjectsQuery } from "@/lib/useProjectsQuery";

type Filter = "all" | "active" | "archived";

export function ProjectsTable() {
	const [filter, setFilter] = useState<Filter>("active");

	const {
		data,
		isLoading,
		isError,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useProjectsQuery();

	// Flatten all pages into a single array
	const allProjects = data?.pages.flatMap((page) => page.projects) ?? [];

	// Filter based on selected tab
	const projects = allProjects.filter((p) => {
		if (filter === "active") return !p.isArchived;
		if (filter === "archived") return p.isArchived;
		return true;
	});

	const tabs: { label: string; value: Filter }[] = [
		{ label: "Actifs", value: "active" },
		{ label: "Archivés", value: "archived" },
		{ label: "Tous", value: "all" },
	];

	if (isLoading) {
		return (
			<section className="overflow-hidden rounded-lg border border-border">
				<div className="flex h-screen items-center justify-center">
					<Loader2 className="size-8 animate-spin text-muted-foreground" />
				</div>
			</section>
		);
	}

	if (isError) {
		return (
			<section className="overflow-hidden rounded-lg border border-border">
				<p className="px-6 py-8 text-center text-sm text-destructive">
					Une erreur est survenue lors du chargement des projets.
				</p>
			</section>
		);
	}

	return (
		<section className="overflow-hidden rounded-lg border border-border">
			{/* Filter tabs */}
			<div className="flex gap-1 border-b border-border px-4 pt-3">
				{tabs.map((tab) => (
					<button
						key={tab.value}
						type="button"
						onClick={() => setFilter(tab.value)}
						className={`px-3 py-1.5 text-sm rounded-t font-medium transition-colors ${
							filter === tab.value
								? "text-foreground border-b-2 border-primary"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			<Table>
				<TableHeader className="bg-muted/50">
					<TableRow>
						<TableHead>Projet</TableHead>
						<TableHead className="hidden md:table-cell">Participants</TableHead>
						<TableHead className="hidden lg:table-cell">Budget</TableHead>
						<TableHead className="hidden text-center sm:table-cell">
							Alerte
						</TableHead>
						<TableHead className="hidden text-right sm:table-cell">
							Ton solde
						</TableHead>
						<TableHead className="w-10">
							<span className="sr-only">Actions</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{projects.length === 0 ? (
						<TableRow>
							<td
								colSpan={6}
								className="px-6 py-8 text-center text-sm text-muted-foreground"
							>
								Aucun projet trouvé.
							</td>
						</TableRow>
					) : (
						projects.map((project) => (
							<ProjectRow key={project.id} project={project} />
						))
					)}
				</TableBody>
			</Table>

			{hasNextPage && (
				<div className="flex justify-center border-t border-border py-3">
					<button
						type="button"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
						className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
					>
						{isFetchingNextPage ? "Chargement..." : "Afficher plus"}
					</button>
				</div>
			)}
		</section>
	);
}
