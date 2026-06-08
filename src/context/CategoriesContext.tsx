import { createContext, useContext, useEffect, useState } from "react";
import { apiGetCategories } from "@/services/api";
import type { ICategories } from "@/types";

// ── Categories context type ─────────────────────────────────────────────────────────────

interface ICategoriesContext {
	isLoading: boolean;
	categories: ICategories[];
}

// ── Categories context creation ─────────────────────────────────────────────────────────────

export const CategoriesContext = createContext<ICategoriesContext | undefined>(
	undefined,
);

interface CategoriesProviderProps {
	children: React.ReactNode;
}

// ── Categories provider ─────────────────────────────────────────────────────────────

export default function CategoriesProvider({
	children,
}: CategoriesProviderProps) {
	const [categories, setCategories] = useState<ICategories[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadCategories() {
			try {
				const data = await apiGetCategories();
				setCategories(data);
			} catch (error) {
				console.error("Failed to load categories", error);
			} finally {
				setIsLoading(false);
			}
		}
		loadCategories();
	}, []);

	const value = {
		categories,
		isLoading,
	};

	return (
		<CategoriesContext.Provider value={value}>
			{children}
		</CategoriesContext.Provider>
	);
}

// ── Custom hook ───────────────────────────────────────────────────────────────
// Gives any component access to the categories
export function useCategories() {
	const context = useContext(CategoriesContext);
	if (!context) {
		throw new Error("useCategories must be used in a un CategoriesProvider");
	}
	return context;
}
