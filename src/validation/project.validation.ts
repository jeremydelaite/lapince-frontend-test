import type { IParticipant, UpdateProjectPayload } from "@/types/project";

export function validateProjectDetails(formData: UpdateProjectPayload) {
	const errors: Record<string, string> = {};

	// =========================
	// NAME
	// =========================
	if (!formData.name || formData.name.trim().length === 0) {
		errors.name = "Le nom est obligatoire";
	} else if (formData.name.trim().length < 2) {
		errors.name = "Le nom du projet doit contenir au moins 2 caractères";
	} else if (formData.name.trim().length > 100) {
		errors.name = "Le nom du projet ne peut pas dépasser 100 caractères";
	}

	// =========================
	// DESCRIPTION
	// =========================
	if (formData.description && formData.description.length > 500) {
		errors.description = "La description ne peut pas dépasser 500 caractères";
	}

	// =========================
	// BUDGET
	// =========================
	if (formData.budget) {
		const amount = formData.budget.amount;
		const limitCriteria = formData.budget.limitCriteria;

		// =========================
		// AMOUNT TYPE CHECK
		// =========================
		if (typeof amount !== "number" || Number.isNaN(amount)) {
			errors.amount = "Veuillez saisir un montant valide";
		} else {
			// =========================
			// PRISMA DECIMAL(10,2) LIMIT
			// =========================

			const MAX_AMOUNT = 99999999.99;

			// négatif ou zéro
			if (amount <= 0) {
				errors.amount = "Le montant du budget doit être supérieur à 0";
			}

			// overflow DB
			if (amount > MAX_AMOUNT) {
				errors.amount = "Le montant ne peut pas dépasser 99 999 999.99";
			}

			// contrôle décimales (max 2)
			const decimals = amount.toString().split(".")[1];
			if (decimals && decimals.length > 2) {
				errors.amount = "Maximum 2 chiffres après la virgule";
			}
		}

		// =========================
		// LIMIT CRITERIA
		// =========================
		if (typeof limitCriteria !== "number" || Number.isNaN(limitCriteria)) {
			errors.limitCriteria = "Veuillez saisir un pourcentage valide";
		} else if (limitCriteria < 0 || limitCriteria > 100) {
			errors.limitCriteria =
				"Le seuil d’alerte doit être compris entre 0 et 100";
		}
	}

	return errors;
}

export function validateProjectParticipants(participants: IParticipant[]) {
	const errors: Record<string, string> = {};

	participants.forEach((p, index) => {
		const name = p.name?.trim();

		if (!name || name.length === 0) {
			errors[`name-${index}`] =
				"Au moins deux lettres doivent être renseignées.";
		} else if (name.length < 2) {
			errors[`name-${index}`] =
				"Au moins deux lettres doivent être renseignées.";
		} else if (name.length > 100) {
			errors[`name-${index}`] =
				"Le nom du participant ne peut pas dépasser 100 caractères.";
		}
	});

	return errors;
}
