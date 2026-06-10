import type {
	IOperationDialogParticipant,
	IOperationDialogState,
} from "@/types/operations";

export function getOperationDialogError(
	state: IOperationDialogState,
): string | null {
	if (state.isAmountCalculated) {
		return null;
	}

	const selectedParticipants = state.participants.filter((p) => p.isSelected);
	const fixedAmount = selectedParticipants
		.filter((p) => !p.isRepartitionAmountCalculated)
		.reduce(
			(sum, participant) => sum + Number(participant.repartitionAmount || 0),
			0,
		);
	const operationAmount = Number(state.amount || 0);

	if (fixedAmount > operationAmount) {
		return "La somme des montants saisis dépasse le montant global.";
	}

	if (!state.isBalancedAmount) {
		return "La somme des participants ne correspond pas au montant renseigné.";
	}

	return null;
}

function splitAmountInCents(total: number, count: number): string[] {
	if (count <= 0) return [];

	const totalCents = Math.round(total * 100);
	const baseCents = Math.floor(totalCents / count);
	const remainder = totalCents % count;

	return Array.from({ length: count }, (_, index) => {
		const cents = baseCents + (index < remainder ? 1 : 0);
		return (cents / 100).toFixed(2);
	});
}

function applyCalculatedRepartition(
	state: IOperationDialogState,
	amountToSplit: number,
): IOperationDialogParticipant[] {
	const count = state.participants.filter(
		(p) => p.isSelected && p.isRepartitionAmountCalculated,
	).length;

	const distributedAmounts = splitAmountInCents(amountToSplit, count);
	let calculatedIndex = 0;

	return state.participants.map((participant) => {
		if (!participant.isSelected) {
			return { ...participant, repartitionAmount: "" };
		}

		if (!participant.isRepartitionAmountCalculated) {
			return participant;
		}

		return {
			...participant,
			repartitionAmount: distributedAmounts[calculatedIndex++] ?? "0.00",
		};
	});
}

export function recalculateOperationState(
	state: IOperationDialogState,
): IOperationDialogState {
	const selectedParticipants = state.participants.filter((p) => p.isSelected);

	const selectedParticipantsNotCalculated = selectedParticipants.filter(
		(p) => !p.isRepartitionAmountCalculated,
	);

	const fixedAmount = selectedParticipantsNotCalculated.reduce(
		(sum, participant) => sum + Number(participant.repartitionAmount || 0),
		0,
	);

	const amount = selectedParticipants.length === 0 ? "" : String(fixedAmount);
	// Cas 1 : le montant global est calculé automatiquement
	// → amount = somme des montants saisis manuellement
	// → les participants calculés reçoivent 0.00
	if (state.isAmountCalculated) {
		const nextParticipants = applyCalculatedRepartition(state, 0);

		return {
			...state,
			participants: nextParticipants,
			amount: String(amount),
			isBalancedAmount: true,
		};
	}

	// Cas 2 : le montant global est saisi manuellement
	// → on répartit le reste entre les participants calculés
	const amountToSplit = Number(state.amount || 0) - fixedAmount;

	const nextParticipants = applyCalculatedRepartition(state, amountToSplit);

	const nextAmount = nextParticipants
		.filter((p) => p.isSelected)
		.reduce((sum, p) => sum + Number(p.repartitionAmount || 0), 0);

	const balancedAmount =
		Math.round(Number(state.amount || 0) * 100) ===
		Math.round(nextAmount * 100);

	return {
		...state,
		participants: nextParticipants,
		isBalancedAmount: balancedAmount,
	};
}
