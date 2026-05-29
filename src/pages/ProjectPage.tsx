import { ConnectedHeader } from "@/components/common/ConnectedHeader";
import { BudgetAlerts } from "@/components/project/BudgetAlerts";
import { ProjectHeading } from "@/components/project/ProjectHeading";
import { ProjectTabs } from "@/components/project/ProjectTabs";
import { DetailsTab } from "@/components/project/tabs/DetailsTab";
import { OperationTab } from "@/components/project/tabs/OperationTab";
import { OverviewTab } from "@/components/project/tabs/OverviewTab";

export function ProjectPage() {
	return (
		<>
			<ConnectedHeader />
			<main className="mx-auto max-w-5xl px-6 py-10">
				<ProjectHeading />
				<ProjectTabs />
				<BudgetAlerts />
				<OverviewTab />
				<DetailsTab />
				<OperationTab />
			</main>
		</>
	);
}
