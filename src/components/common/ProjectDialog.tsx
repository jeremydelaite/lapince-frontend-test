import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { useAuth } from "@/context/AuthContext";
import { useCreateProjectMutation } from "@/lib/useProjectsQuery";

type Participant = { id: number; name: string };

type ProjectDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	submitLabel?: string;
};

export function ProjectDialog({
	open,
	onOpenChange,
	title,
	submitLabel = "Créer le projet",
}: ProjectDialogProps) {
	const { mutate: createProject, isPending } = useCreateProjectMutation();
	const { user } = useAuth();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState("Voyage");
	const [budgetAmount, setBudgetAmount] = useState("");
	const [alertEnabled, setAlertEnabled] = useState(false);
	const [limitCriteria, setLimitCriteria] = useState(80);
	const [includeMe, setIncludeMe] = useState(true);
	const [participants, setParticipants] = useState<Participant[]>([]);

	// Resets all
	function resetForm() {
		setName("");
		setDescription("");
		setType("Voyage");
		setBudgetAmount("");
		setAlertEnabled(false);
		setLimitCriteria(80);
		setIncludeMe(true);
		setParticipants([]);
	}

	// Adds an empty participant slot to the list
	function handleAddParticipant() {
		setParticipants((prev) => [...prev, { id: Date.now(), name: "" }]);
	}

	// Updates a participant name at a given index
	function handleParticipantChange(index: number, value: string) {
		setParticipants((prev) =>
			prev.map((p, i) => (i === index ? { ...p, name: value } : p)),
		);
	}

	// Removes a participant from the list by index
	function handleRemoveParticipant(index: number) {
		setParticipants((prev) => prev.filter((_, i) => i !== index));
	}

	// Handles form submission
	function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();

		if (alertEnabled && !budgetAmount) {
			toast.warning("Veuillez entrer un montant de budget");
			return;
		}

		if (Number(budgetAmount) >= 100_000_000) {
			toast.warning("Le montant du budget ne peut pas dépasser 8 chiffres");
			return;
		}

		createProject(
			{
				name,
				description: description || undefined,
				type,
				budget: alertEnabled
					? {
							amount: Number(budgetAmount),
							alertEnabled,
							limitCriteria,
						}
					: undefined,
				// Prepend the current user if includeMe is checkek
				participants: [
					...(includeMe && user ? [{ name: user.name, isMe: true }] : []),
					...participants.filter((p) => p.name.trim() !== ""),
				],
			},
			{
				onSuccess: () => {
					resetForm();
					onOpenChange(false);
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<form className="space-y-5" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label htmlFor="project-name">Nom du projet</Label>
						<Input
							id="project-name"
							placeholder="Week-end à Lisbonne"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="project-description">
							Description{" "}
							<span className="text-muted-foreground">(optionnel)</span>
						</Label>
						<Textarea
							id="project-description"
							rows={3}
							placeholder="3 jours entre amis."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label>Type</Label>
						<Select
							value={type}
							onValueChange={(value) => setType(value ?? "Voyage")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choisir un type" />
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
								id="project-alert"
								checked={alertEnabled}
								onCheckedChange={setAlertEnabled}
							/>
							<Label htmlFor="project-alert">Activer un seuil d’alerte</Label>
						</div>

						{alertEnabled && (
							<>
								<div className="space-y-2">
									<Label htmlFor="project-budget">
										Budget global{" "}
										<span className="text-muted-foreground">(optionnel)</span>
									</Label>

									<div className="relative">
										<Input
											id="project-budget"
											type="number"
											placeholder="1000"
											className="pr-8"
											value={budgetAmount}
											onChange={(e) => setBudgetAmount(e.target.value)}
										/>
										<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
											€
										</span>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<Slider
										value={[limitCriteria]}
										max={100}
										step={1}
										onValueChange={(value) =>
											setLimitCriteria(Array.isArray(value) ? value[0] : value)
										}
									/>
									<span className="w-12 text-right text-xs font-medium tabular-nums">
										{limitCriteria} %
									</span>
								</div>
							</>
						)}
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label>
								Participants{" "}
								<span className="text-muted-foreground">(optionnel)</span>
							</Label>

							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleAddParticipant}
							>
								<Plus className="size-4" />
								Ajouter
							</Button>
						</div>

						<div className="flex items-center gap-2">
							<Checkbox
								id="include-me"
								checked={includeMe}
								onCheckedChange={(checked) => setIncludeMe(!!checked)}
							/>
							<Label htmlFor="include-me" className="font-normal">
								M'inclure ({user?.name})
							</Label>
						</div>

						<ul className="space-y-2">
							{participants.map((p, index) => (
								<li key={p.id} className="flex items-center gap-2">
									<Input
										placeholder="Nom du participant"
										value={p.name}
										onChange={(e) =>
											handleParticipantChange(index, e.target.value)
										}
									/>
									{/* <div className="relative w-32 shrink-0">
										<Input
											type="number"
											placeholder="Montant"
											className="pr-7 text-right tabular-nums"
										/>
										<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
											€
										</span>
									</div> */}
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="text-muted-foreground hover:text-destructive"
										onClick={() => handleRemoveParticipant(index)}
									>
										<Trash2 className="size-4" />
									</Button>
								</li>
							))}
						</ul>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Annuler
						</Button>

						<Button type="submit" disabled={isPending}>
							{isPending ? "Création..." : submitLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
