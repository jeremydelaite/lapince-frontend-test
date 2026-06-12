import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/context/CategoriesContext";
import {
	apiCreateOperation,
	apiDeleteOperation,
	apiUpdateOperation,
} from "@/services/api";
import type {
	CreateOperationPayload,
	IOperationDialogState,
} from "@/types/operations";
import {
	getOperationDialogError,
	recalculateOperationState,
} from "@/utils/recalculateOperationState";

type OperationDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	operationDialogState: IOperationDialogState | null;
	setOperationDialogState: (state: IOperationDialogState | null) => void;
	onOperationChanged: () => void | Promise<void>;
};

export function OperationDialog({
	open,
	onOpenChange,
	operationDialogState,
	setOperationDialogState,
	onOperationChanged,
}: OperationDialogProps) {
	const { categories } = useCategories();
	const dialogMode = operationDialogState?.mode ?? "create";
	const selectedCategory = categories.find(
		(category) => category.id === operationDialogState?.categoryId,
	);
	const selectedPayerParticipant = operationDialogState?.participants.find(
		(participant) =>
			participant.participantId === operationDialogState.payerParticipantId,
	);

	const operationError = operationDialogState
		? getOperationDialogError(operationDialogState)
		: null;

	async function handleDelete() {
		if (
			!operationDialogState ||
			operationDialogState.operationId == null ||
			operationDialogState.projectId == null
		) {
			return;
		}
		try {
			await apiDeleteOperation(
				operationDialogState.operationId,
				operationDialogState.projectId,
			);
			await onOperationChanged();
			onOpenChange(false);
			setOperationDialogState(null);
		} catch {
			toast.error("Impossible de supprimer l'opération");
		}
	}

	async function handleSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		if (!operationDialogState) return;
		try {
			const payload = buildCreateOperationPayload(operationDialogState);
			if (operationDialogState.mode === "create") {
				await apiCreateOperation(payload);
			} else {
				if (!operationDialogState.operationId) return;
				await apiUpdateOperation(operationDialogState.operationId, payload);
			}
			await onOperationChanged();
			onOpenChange(false);
			setOperationDialogState(null);
		} catch {
			toast.error("Impossible de sauvegarder l'opération");
		}
	}

	function buildCreateOperationPayload(
		operationDialogState: IOperationDialogState,
	): CreateOperationPayload {
		return {
			name: operationDialogState.name,
			amount: Number(operationDialogState.amount),
			date: operationDialogState.date,
			categoryId: Number(operationDialogState.categoryId),
			isAmountCalculated: operationDialogState.isAmountCalculated,
			projectId: Number(operationDialogState.projectId),
			payerParticipantId: Number(operationDialogState.payerParticipantId),
			operationParticipants: operationDialogState.participants
				.filter((participant) => participant.isSelected)
				.map((participant) => ({
					participantId: participant.participantId,
					repartitionAmount: Number(participant.repartitionAmount),
					isRepartitionAmountCalculated:
						participant.isRepartitionAmountCalculated,
				})),
		};
	}
	// Update the dialog state and recalculate all derived amounts
	// to keep the operation data consistent.
	function updateOperationDialogState(updates: Partial<IOperationDialogState>) {
		if (!operationDialogState) return;
		const nextState = {
			...operationDialogState,
			...updates,
		};
		setOperationDialogState(recalculateOperationState(nextState));
	}

	// Format a Date object as YYYY-MM-DD in local time.
	// Used by the shadcn Calendar to avoid timezone shifts caused by
	// Date.toISOString() and to keep the selected day unchanged.
	function formatDateLocal(date: Date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	function parseDateLocal(date: string) {
		return new Date(`${date}T00:00:00`);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{dialogMode === "edit"
							? "Modifier l'opération"
							: "Nouvelle opération"}
					</DialogTitle>
				</DialogHeader>

				<form className="space-y-5" onSubmit={handleSubmit}>
					<div className="grid grid-cols-5 gap-3">
						<div className="col-span-3 space-y-2">
							<Label htmlFor="operation-description">Description</Label>
							<Input
								required
								id="operation-description"
								placeholder="Dîner Time Out Market"
								value={operationDialogState?.name ?? ""}
								onChange={(event) =>
									updateOperationDialogState({ name: event.target.value })
								}
							/>
						</div>

						<div className="col-span-2 space-y-2">
							<Label htmlFor="operation-amount">Montant</Label>
							<div className="relative">
								<Input
									id="operation-amount"
									type="number"
									// min="0.01"
									step="0.01"
									min="0"
									placeholder={
										operationDialogState?.isAmountCalculated
											? operationDialogState.amount || "auto"
											: "auto"
									}
									className={`pr-8 text-right font-medium focus:placeholder-transparent ${
										Number(operationDialogState?.amount || 0) < 0
											? "border-red-500 focus-visible:ring-red-500"
											: ""
									}`}
									value={
										!operationDialogState?.isAmountCalculated
											? (operationDialogState?.amount ?? "")
											: ""
									}
									onChange={(event) =>
										updateOperationDialogState({
											amount: event.target.value,
											isAmountCalculated: event.target.value === "",
										})
									}
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
									€
								</span>
							</div>
						</div>
					</div>

					<div className="grid gap-3 min-[430px]:grid-cols-10">
						<div className="min-[430px]:col-span-7 space-y-2">
							<Label>Catégorie</Label>

							<Select
								required
								value={String(operationDialogState?.categoryId ?? "")}
								onValueChange={(value) =>
									updateOperationDialogState({
										categoryId: Number(value),
									})
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Catégorie">
										{selectedCategory?.name ?? "Catégorie"}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.id} value={String(category.id)}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="min-[430px]:col-span-3 space-y-2">
							<Label htmlFor="operation-date">Date</Label>
							<Popover>
								<PopoverTrigger
									render={
										<Button
											id="operation-date"
											type="button"
											variant="outline"
											className="w-full justify-start text-left font-normal"
										/>
									}
								>
									{operationDialogState?.date
										? parseDateLocal(
												operationDialogState.date,
											).toLocaleDateString("fr-FR")
										: "Sélectionner une date"}
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={
											operationDialogState?.date
												? parseDateLocal(operationDialogState.date)
												: undefined
										}
										onSelect={(date) =>
											updateOperationDialogState({
												date: date ? formatDateLocal(date) : "",
											})
										}
									/>
								</PopoverContent>
							</Popover>{" "}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Payé par</Label>

						<Select
							required
							value={String(operationDialogState?.payerParticipantId ?? "")}
							onValueChange={(payerParticipantId) =>
								updateOperationDialogState({
									payerParticipantId: Number(payerParticipantId),
								})
							}
						>
							<SelectTrigger className="w-full">
								<span>{selectedPayerParticipant?.name ?? "Participant"}</span>
							</SelectTrigger>
							<SelectContent>
								{operationDialogState?.participants.map((participant) => (
									<SelectItem
										key={participant.participantId}
										value={String(participant.participantId)}
									>
										{participant.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<div className="flex items-baseline justify-between">
							<Label>Participants actifs</Label>
							<label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
								<input
									type="checkbox"
									className="size-4"
									checked={
										operationDialogState?.participants.every(
											(p) => p.isSelected,
										) ?? false
									}
									onChange={(event) =>
										updateOperationDialogState({
											participants: operationDialogState!.participants.map(
												(p) => ({
													...p,
													isSelected: event.target.checked,
													repartitionAmount: "",
													isRepartitionAmountCalculated: true,
												}),
											),
										})
									}
								/>
								Tout sélectionner
							</label>
						</div>

						<ul className="overflow-hidden rounded-md border border-border">
							{operationDialogState?.participants.map((participant) => (
								<li
									key={participant.participantId}
									className="flex items-center gap-3 border-b border-border px-3 py-2 last:border-b-0"
								>
									<label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
										<input
											type="checkbox"
											checked={participant.isSelected}
											onChange={(event) =>
												updateOperationDialogState({
													participants: operationDialogState.participants.map(
														(op) =>
															op.participantId === participant.participantId
																? {
																		...op,
																		isSelected: event.target.checked,
																		repartitionAmount: "",
																		isRepartitionAmountCalculated: true,
																	}
																: op,
													),
												})
											}
											className="size-4"
										/>

										<span
											className={`flex size-7 text-white shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${participant.avatarColor}`}
										>
											{participant.initials}
										</span>

										<span className="truncate text-sm">{participant.name}</span>
									</label>

									<div className="relative w-28 shrink-0">
										<Input
											type="number"
											disabled={!participant.isSelected}
											min="0"
											step="0.01"
											placeholder={
												!participant.isSelected
													? "-"
													: participant.isRepartitionAmountCalculated
														? participant.repartitionAmount || "auto"
														: ""
											}
											className={`h-8 pr-6 text-right text-xs tabular-nums placeholder:italic focus:placeholder-transparent ${
												Number(participant.repartitionAmount || 0) < 0
													? "border-red-500 focus-visible:ring-red-500"
													: ""
											}`}
											value={
												participant.isSelected &&
												!participant.isRepartitionAmountCalculated
													? participant.repartitionAmount
													: ""
											}
											onChange={(event) =>
												updateOperationDialogState({
													participants: operationDialogState.participants.map(
														(op) =>
															op.participantId === participant.participantId
																? {
																		...op,
																		repartitionAmount: event.target.value,
																		isRepartitionAmountCalculated:
																			event.target.value === "",
																	}
																: op,
													),
												})
											}
										/>

										<span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
											€
										</span>
									</div>
								</li>
							))}
						</ul>
					</div>

					<DialogFooter className="!flex !flex-col !items-stretch gap-2">
						{operationError && (
							<p className="w-full text-center text-sm text-destructive">
								{operationError}
							</p>
						)}
						<div className="flex w-full items-center justify-between">
							<div>
								{dialogMode === "edit" && (
									<Button
										type="button"
										variant="destructive"
										onClick={handleDelete}
									>
										<Trash2 className="size-4" />
									</Button>
								)}
							</div>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => onOpenChange(false)}
								>
									Annuler
								</Button>
								<Button
									type="submit"
									disabled={Boolean(
										operationError ||
											!operationDialogState?.hasSelectedParticipant,
									)}
								>
									{dialogMode === "edit" ? "Modifier" : "Créer"}
								</Button>
							</div>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
