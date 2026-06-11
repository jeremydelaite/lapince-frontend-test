import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProject } from "@/context/ProjectContext";
import { PROJECT_TYPE_LABELS } from "@/lib/utils";
import type { UpdateProjectPayload } from "@/types/project";

type ProjectDetailsFormProps = {
	formData: UpdateProjectPayload;
	setFormData: Dispatch<SetStateAction<UpdateProjectPayload>>;
	isEditingDetails: boolean;
	detailsFormErrors: Record<string, string>;
};
export function ProjectDetailsForm({
	formData,
	setFormData,
	isEditingDetails,
	detailsFormErrors,
}: ProjectDetailsFormProps) {
	const { isLoading: isProjectLoading, project } = useProject();

	// Wait until project data is available before rendering the form
	if (isProjectLoading || !project) {
		return <div>Loading...</div>;
	}

	return (
		<form
			className={`space-y-5 rounded-lg border bg-card p-6 ${
				isEditingDetails ? "border-amber-400" : "border-border"
			}`}
		>
			<div className="space-y-2">
				<Label htmlFor="project-name">Nom du projet</Label>
				<Input
					id="project-name"
					value={formData.name ?? ""}
					// Controlled input: every keystroke updates formData
					onChange={(e) =>
						setFormData((prev) => ({
							...prev,
							name: e.target.value,
						}))
					}
					disabled={!isEditingDetails}
				/>
				{detailsFormErrors.name && (
					<p className="text-sm text-red-500">{detailsFormErrors.name}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="project-description">
					Description <span className="text-muted-foreground">(optionnel)</span>
				</Label>
				<Textarea
					id="project-description"
					value={formData.description ?? ""}
					onChange={(e) =>
						setFormData((prev) => ({
							...prev,
							description: e.target.value,
						}))
					}
					disabled={!isEditingDetails}
				/>
				{detailsFormErrors.description && (
					<p className="text-sm text-red-500">
						{detailsFormErrors.description}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label>Type</Label>
				<Select
					// Use form value if modified, otherwise fallback to project value
					value={formData.type ?? project.type}
					onValueChange={(value) => {
						if (!value) return;

						setFormData((prev) => ({
							...prev,
							type: value,
						}));
					}}
					disabled={!isEditingDetails}
				>
					<SelectTrigger>
						{/* To display correctly type label */}
						<SelectValue>
							{PROJECT_TYPE_LABELS[formData.type ?? project.type] ??
								"Choisir un type"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Voyage">Voyage</SelectItem>
						<SelectItem value="Maison_Coloc">Maison / Coloc</SelectItem>
						<SelectItem value="Anniversaire">Anniversaire</SelectItem>
						<SelectItem value="Repas_Sortie">Repas / Sortie</SelectItem>
						<SelectItem value="Pro_Travail">Pro / Travail</SelectItem>
						<SelectItem value="Autre">Autre</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<Switch
						id="budget-alert"
						// Budget existence drives the switch state
						checked={!!formData.budget}
						onCheckedChange={(checked) =>
							setFormData((prev) => ({
								...prev,
								// ON => create budget object if needed
								// OFF => remove budget from payload
								budget: checked
									? {
											id: prev.budget?.id ?? 0,
											amount: prev.budget?.amount ?? 0,
											limitCriteria: prev.budget?.limitCriteria ?? 80,
										}
									: undefined,
							}))
						}
						disabled={!isEditingDetails}
					/>
					<Label htmlFor="budget-alert">Activer un seuil d’alerte</Label>
				</div>

				{/* Budget fields are rendered only when a budget exists */}
				{formData.budget && (
					<>
						<div className="space-y-2">
							<Label htmlFor="project-budget">Budget global</Label>
							<div className="relative">
								<Input
									className=" no-spinner"
									id="project-budget"
									type="number"
									disabled={!isEditingDetails}
									value={formData.budget?.amount ?? ""}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											budget: {
												...prev.budget,
												id: prev.budget?.id ?? 0,
												// Convert input string to number
												amount: Number(e.target.value),
												limitCriteria: prev.budget?.limitCriteria ?? 80,
											},
										}))
									}
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
									€
								</span>
							</div>
							{detailsFormErrors.amount && (
								<p className="text-sm text-red-500">
									{detailsFormErrors.amount}
								</p>
							)}
						</div>

						<div className="flex items-center gap-3">
							<Slider
								disabled={!isEditingDetails}
								max={100}
								step={1}
								// Slider expects an array value
								value={[formData.budget?.limitCriteria ?? 80]}
								onValueChange={(value) =>
									setFormData((prev) => ({
										...prev,
										budget: {
											...prev.budget,
											id: prev.budget?.id ?? 0,
											amount: prev.budget?.amount ?? 0,
											// Slider returns an array, keep only the first value
											limitCriteria: Array.isArray(value) ? value[0] : value,
										},
									}))
								}
							/>
							<span className="w-12 text-right text-xs font-medium tabular-nums">
								{formData.budget?.limitCriteria} %
							</span>
						</div>
					</>
				)}
			</div>
		</form>
	);
}
