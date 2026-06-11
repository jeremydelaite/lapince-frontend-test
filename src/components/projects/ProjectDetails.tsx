import {
	Briefcase,
	Cake,
	FolderOpen,
	Home,
	Plane,
	Utensils,
} from "lucide-react";

type ProjectIcon =
	| "plane"
	| "home"
	| "cake"
	| "utensils"
	| "briefcase"
	| "folder";

type ProjectDetailsProps = {
	name: string;
	expensesCount: number;
	updatedAt: string;
	icon: ProjectIcon;
	color?: string;
};

const projectIcons = {
	plane: Plane,
	home: Home,
	cake: Cake,
	utensils: Utensils,
	briefcase: Briefcase,
	folder: FolderOpen,
};

export function ProjectDetails({
	name,
	expensesCount,
	updatedAt,
	icon,
	color = "bg-accent text-accent-foreground",
}: ProjectDetailsProps) {
	const Icon = projectIcons[icon];
	return (
		<div className="flex min-w-0 items-center gap-3">
			<span
				className={`inline-flex size-9 shrink-0 items-center justify-center rounded-md ${color}`}
			>
				<Icon className="size-4" />
			</span>
			<div className="min-w-0">
				<p className="truncate font-medium">{name}</p>
				<p className="mt-0.5 text-xs text-muted-foreground">
					{expensesCount} dépenses · {updatedAt}
				</p>
			</div>
		</div>
	);
}
