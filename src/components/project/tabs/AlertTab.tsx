import { AlertTriangle, Bell } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiMarkAlertAsRead } from "@/services/api";
import type { Alert as AlertType } from "@/types/alert";

type AlertTabProps = {
	alerts: AlertType[];
	onAlertRead: (alertId: number) => void;
};

export function AlertTab({ alerts, onAlertRead }: AlertTabProps) {
	const activeAlerts = alerts.filter((a) => a.status !== "resolved");
	const resolvedAlerts = alerts.filter((a) => a.status === "resolved");
	const unreadCount = activeAlerts.filter((a) => a.status === "unread").length;

	async function handleMarkAsRead(alertId: number) {
		await apiMarkAlertAsRead(alertId, { status: "read" });
		onAlertRead(alertId);
	}

	if (activeAlerts.length === 0 && resolvedAlerts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 py-16 text-zinc-400">
				<Bell className="h-10 w-10" />
				<p className="text-sm">Aucune alerte pour le moment</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{unreadCount > 0 && (
				<p className="text-sm font-medium text-amber-700">
					{unreadCount} alerte{unreadCount > 1 ? "s" : ""} non lue
					{unreadCount > 1 ? "s" : ""}
				</p>
			)}

			{activeAlerts.map((alert) => {
				const isUnread = alert.status === "unread";
				return (
					<Alert
						key={alert.id}
						className={
							isUnread
								? "border-amber-200 bg-amber-50 text-amber-900"
								: "border-zinc-200 bg-zinc-50 text-zinc-600"
						}
					>
						<div className="flex items-start gap-3">
							<span
								className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
									isUnread ? "bg-amber-200" : "bg-zinc-200"
								}`}
							>
								<AlertTriangle
									className={`h-3.5 w-3.5 ${
										isUnread ? "text-amber-700" : "text-zinc-500"
									}`}
								/>
							</span>
							<div className="flex-1">
								<AlertTitle className="mb-1">{alert.message}</AlertTitle>
								<p className="text-xs">
									{new Date(alert.createdAt).toLocaleDateString("fr-FR", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</p>
							</div>
							{isUnread && (
								<Button
									variant="outline"
									size="sm"
									className="shrink-0 border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
									onClick={() => handleMarkAsRead(alert.id)}
								>
									Marquer comme lu
								</Button>
							)}
						</div>
					</Alert>
				);
			})}

			{resolvedAlerts.length > 0 && (
				<>
					<p className="mt-2 text-sm font-medium text-zinc-400">Historique</p>
					{resolvedAlerts.map((alert) => (
						<Alert
							key={alert.id}
							className="border-zinc-100 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
						>
							<div className="flex items-start gap-3">
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
									<AlertTriangle className="h-3.5 w-3.5 text-zinc-400" />
								</span>
								<div className="flex-1">
									<AlertTitle className="mb-1 opacity-60">
										{alert.message}
									</AlertTitle>
									<p className="text-xs opacity-50">
										{new Date(alert.createdAt).toLocaleDateString("fr-FR", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</p>
								</div>
							</div>
						</Alert>
					))}
				</>
			)}
		</div>
	);
}
