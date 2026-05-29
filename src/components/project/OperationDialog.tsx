import { Button } from "@/components/ui/button";
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

type OperationDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function OperationDialog({ open, onOpenChange }: OperationDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Nouvelle opération</DialogTitle>
				</DialogHeader>

				<form className="space-y-5">
					<div className="grid grid-cols-5 gap-3">
						<div className="col-span-3 space-y-2">
							<Label htmlFor="operation-description">Description</Label>
							<Input
								id="operation-description"
								placeholder="Dîner Time Out Market"
							/>
						</div>

						<div className="col-span-2 space-y-2">
							<Label htmlFor="operation-amount">Montant</Label>
							<div className="relative">
								<Input
									id="operation-amount"
									type="number"
									step="0.01"
									placeholder="128,40"
									className="pr-8 text-right font-medium"
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
									€
								</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Catégorie</Label>
							<Select defaultValue="food">
								<SelectTrigger>
									<SelectValue placeholder="Catégorie" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="food">Restauration</SelectItem>
									<SelectItem value="housing">Hébergement</SelectItem>
									<SelectItem value="transport">Transport</SelectItem>
									<SelectItem value="shopping">Courses</SelectItem>
									<SelectItem value="activities">Activités</SelectItem>
									<SelectItem value="other">Autre</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="operation-date">Date</Label>
							<Input
								id="operation-date"
								type="date"
								defaultValue="2026-05-17"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Payé par</Label>
						<Select defaultValue="alice">
							<SelectTrigger>
								<SelectValue placeholder="Participant" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="steve">Steve</SelectItem>
								<SelectItem value="alice">Alice</SelectItem>
								<SelectItem value="bob">Bob</SelectItem>
								<SelectItem value="chloe">Chloé</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Annuler
						</Button>

						<Button type="submit">Créer</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
