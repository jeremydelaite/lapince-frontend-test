import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiGetProjectAlerts } from "@/services/api";
import type { Alert } from "@/types/alert";
import { AlertTab } from "./tabs/AlertTab";
import { DetailsTab } from "./tabs/DetailsTab";
import { OperationTab } from "./tabs/OperationTab";
import { OverviewTab } from "./tabs/OverviewTab";

type TabValue = "overview" | "details" | "expenses" | "alerts";

type ProjectTabsProps = {
	projectId: number;
};

export function ProjectTabs({ projectId }: ProjectTabsProps) {
	const [activeTab, setActiveTab] = useState<TabValue>("overview");
	const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
	const [autoOpenDialog, setAutoOpenDialog] = useState(false);

	const [alerts, setAlerts] = useState<Alert[]>([]);

	const fetchAlerts = useCallback(() => {
		apiGetProjectAlerts(projectId)
			.then(setAlerts)
			.catch(() => {});
	}, [projectId]);

	useEffect(() => {
		fetchAlerts();
	}, [fetchAlerts]);

	const unreadCount = alerts.filter((a) => a.status === "unread").length;

	function handleAlertRead(alertId: number) {
		setAlerts((prev) =>
			prev.map((a) =>
				a.id === alertId ? { ...a, status: "read" as const } : a,
			),
		);
	}

	function handleCategoryClick(categoryId: number) {
		setCategoryFilter(categoryId);
		setActiveTab("expenses");
	}
	function handleTabChange(value: string) {
		if (value !== "expenses") {
			setCategoryFilter(null);
		}
		setActiveTab(value as TabValue);
	}

	function handleNewOperation() {
		setActiveTab("expenses");
		setAutoOpenDialog(true);
	}

	return (
		<Tabs value={activeTab} onValueChange={handleTabChange} className="pb-6">
			<div className="mb-4 border-b">
				<TabsList variant="line">
					<TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
					<TabsTrigger value="details">Détails</TabsTrigger>
					<TabsTrigger value="expenses">Opérations</TabsTrigger>
					<TabsTrigger value="alerts" className="relative">
						Alertes
						{unreadCount > 0 && (
							<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-white">
								{unreadCount}
							</span>
						)}
					</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="overview">
				<OverviewTab
					onCategoryClick={handleCategoryClick}
					onNewOperation={handleNewOperation}
				/>
			</TabsContent>
			<TabsContent value="details">
				<DetailsTab onBudgetUpdated={fetchAlerts} />
			</TabsContent>
			<TabsContent value="expenses">
				<OperationTab
					initialFilter={categoryFilter}
					onOperationMutated={fetchAlerts}
					autoOpen={autoOpenDialog}
					onAutoOpenHandled={() => setAutoOpenDialog(false)}
				/>
			</TabsContent>
			<TabsContent value="alerts">
				<AlertTab alerts={alerts} onAlertRead={handleAlertRead} />
			</TabsContent>
		</Tabs>
	);
}
