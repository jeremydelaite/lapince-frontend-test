import { ArrowRight } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import type { Reimbursement } from "@/types/reimbursement";

export function BalanceCard() {
	const { reimbursements } = useProject();

	if (!reimbursements.length) {
		return (
			<div className="rounded-lg border border-dashed border-border p-6 text-center">
				<p className="text-sm font-medium">Balance équilibrée</p>
				<p className="text-xs text-muted-foreground mt-1">
					Les remboursements à effectuer apparaîtront ici.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border border-border bg-card">
			<div className="flex items-baseline justify-between border-b border-border px-6 py-4">
				<h2 className="text-sm font-medium">Balance</h2>

				<p className="text-xs text-muted-foreground">
					{reimbursements.length} transaction
					{reimbursements.length > 1 ? "s" : ""}
				</p>
			</div>

			<ul className="divide-y divide-border">
				{reimbursements.map((reimbursement: Reimbursement) => (
					<li
						key={`${reimbursement.from}-${reimbursement.to}`}
						className="flex items-center gap-3 px-6 py-4"
					>
						<div className="flex flex-1 items-center gap-1.5 text-sm">
							<span className="font-medium">{reimbursement.from}</span>
							<ArrowRight className="size-3.5 text-muted-foreground" />
							<span className="font-medium">{reimbursement.to}</span>
						</div>
						<span className="tabular-nums text-sm font-semibold">
							{reimbursement.amount.toLocaleString("fr-FR", {
								style: "currency",
								currency: "EUR",
							})}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
