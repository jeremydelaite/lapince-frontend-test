import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailsTab } from "./tabs/DetailsTab";
import { OperationTab } from "./tabs/OperationTab";
import { OverviewTab } from "./tabs/OverviewTab";

export function ProjectTabs() {
	return (
		<Tabs defaultValue="overview" className="pb-6">
			<div className="mb-4 border-b">
				<TabsList variant="line">
					<TabsTrigger value="overview">Vue d’ensemble</TabsTrigger>
					<TabsTrigger value="details">Détails</TabsTrigger>
					<TabsTrigger value="expenses">Opérations</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="overview">
				<OverviewTab />
			</TabsContent>

			<TabsContent value="details">
				<DetailsTab />
			</TabsContent>

			<TabsContent value="expenses">
				<OperationTab />
			</TabsContent>
		</Tabs>
	);
}
