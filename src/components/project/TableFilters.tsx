import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import type { ICategories } from "@/types";
import type { IOperation } from "@/types/operations";

type TableFiltersProps = {
	operations: IOperation[];
	options: ICategories[];
	activeValue: number | null;
	onValueChange: (value: number | null) => void;
	onActionClick?: () => void;
};

export function TableFilters({
	operations,
	options,
	activeValue,
	onValueChange,
	onActionClick,
}: TableFiltersProps) {
	const selectedOption =
		activeValue === null
			? null
			: options.find((option) => option.id === activeValue);

	const operationQuantity = operations.length;

	return (
		<div className="mb-3 flex items-center justify-between gap-3">
			{/* Mobile */}
			<div className="w-full md:hidden">
				<label htmlFor="category-filter" className="sr-only">
					Filtrer les opérations par catégorie
				</label>
				<Select
					value={activeValue === null ? "all" : String(activeValue)}
					onValueChange={(value) =>
						onValueChange(value === "all" ? null : Number(value))
					}
				>
					<SelectTrigger
						className="w-full"
						id="category-filter"
						aria-label="Filtrer les opérations par catégorie"
					>
						<span>
							{selectedOption?.name
								? `${selectedOption?.name} (${selectedOption?.count})`
								: `Toutes les catégories (${operationQuantity})`}
						</span>
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="all">Toutes les catégories</SelectItem>

						{options.map((option) => (
							<SelectItem key={option.id} value={String(option.id)}>
								{option.name} ({option.count})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Desktop */}
			<div className="hidden items-center rounded-md bg-muted p-1 text-sm md:inline-flex">
				<button
					type="button"
					onClick={() => onValueChange(null)}
					className={
						activeValue === null
							? "h-7 rounded-md border border-border bg-background px-3 font-medium text-foreground shadow-sm transition"
							: "h-7 rounded-md border border-transparent px-3 font-medium text-muted-foreground transition hover:text-foreground"
					}
				>
					Toutes
				</button>

				{options.map((option) => {
					const isActive = activeValue === option.id;

					return (
						<button
							key={option.id}
							type="button"
							onClick={() => onValueChange(option.id)}
							className={
								isActive
									? "h-7 rounded-md border border-border bg-background px-3 font-medium text-foreground shadow-sm transition"
									: "h-7 rounded-md border border-transparent px-3 font-medium text-foreground/80 transition hover:text-foreground"
							}
						>
							{option?.name}{" "}
							<span className="font-light">({option?.count})</span>
						</button>
					);
				})}
			</div>

			{onActionClick && (
				<Button type="button" onClick={onActionClick}>
					Nouvelle opération
				</Button>
			)}
		</div>
	);
}
