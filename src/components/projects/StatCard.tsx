import type { LucideIcon } from "lucide-react";

type StatCardProps = {
	icon: LucideIcon;
	label: string;
	value: string;
};

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
	return (
		<div className="rounded-lg border border-zinc-200 p-5">
			<div className="mb-2 flex items-center gap-2 text-zinc-500">
				<Icon className="size-3.5" />

				<p className="text-xs font-medium">{label}</p>
			</div>

			<h2 className="text-2xl font-semibold tracking-tight">{value}</h2>
		</div>
	);
}
