import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Mapper to display correctly project type
export const PROJECT_TYPE_LABELS: Record<string, string> = {
	Voyage: "Voyage",
	Maison_Coloc: "Maison / Coloc",
	Anniversaire: "Anniversaire",
	Repas_Sortie: "Repas / Sortie",
	Pro_Travail: "Pro / Travail",
	Autre: "Autre",
};
