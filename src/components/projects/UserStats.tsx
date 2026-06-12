import { ArrowDownLeft, ArrowUpRight, Folder, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/projects/StatCard";
import { useProjectsQuery } from "@/lib/useProjectsQuery";
import { apiGetGlobalBalance, type GlobalBalance } from "@/services/api";

export function UserStats() {
	const { data } = useProjectsQuery();
	const activeProjectsCount = data?.pages[0]?.total ?? 0;
	const [balance, setBalance] = useState<GlobalBalance | null>(null);

	useEffect(() => {
		apiGetGlobalBalance()
			.then(setBalance)
			.catch(() => toast.error("Impossible de charger le solde global"));
	}, []);

	const formatEuro = (amount: number) =>
		amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
	return (
		<section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
			<StatCard
				icon={Folder}
				label="Projets actifs"
				value={String(activeProjectsCount)}
			/>

			<StatCard
				icon={ArrowDownLeft}
				label="Tu dois"
				value={balance ? formatEuro(balance.toDo) : "—"}
			/>

			<StatCard
				icon={ArrowUpRight}
				label="On te doit"
				value={balance ? formatEuro(balance.toReceive) : "—"}
			/>

			<StatCard
				icon={Wallet}
				label="Solde net"
				value={
					balance
						? `${balance.netBalance >= 0 ? "+" : ""}${formatEuro(balance.netBalance)}`
						: "—"
				}
			/>
		</section>
	);
}
