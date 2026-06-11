import { OperationsRow } from "@/components/project/OperationsRow";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { IOperation } from "@/types/operations";
import { Loader2 } from "lucide-react";

type OperationsTableProps = {
	operations: IOperation[];
	isLoading: boolean;
	error: string | null;
	isArchived?: boolean;
	setSelectedOperation: (operation: IOperation | null) => void;
	setIsOperationDialogOpen: (open: boolean) => void;
};

export function OperationsTable({
	operations,
	isLoading,
	error,
	isArchived,
	setSelectedOperation,
	setIsOperationDialogOpen,
}: OperationsTableProps) {
	const totalAmount = operations.reduce(
		(total, op) => total + Number(op.amount),
		0,
	);
	const formattedTotalAmount = totalAmount.toLocaleString("fr-FR", {
		style: "currency",
		currency: "EUR",
	});

	const footerRows = [
		{ className: "sm:hidden", colSpan: undefined },
		{ className: "hidden sm:table-row md:hidden", colSpan: 3 },
		{ className: "hidden md:table-row", colSpan: 4 },
	];

	if (isLoading) return (
		<div className="flex justify-center py-8">
			<Loader2 className="size-6 animate-spin text-muted-foreground" />
		</div>
	);

	if (error) return <div>{error}</div>;
	return (
		<section className="overflow-hidden rounded-lg border border-border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Description</TableHead>
						<TableHead className="hidden sm:table-cell">Date</TableHead>
						<TableHead className="hidden md:table-cell">Payé par</TableHead>
						<TableHead className="hidden sm:table-cell">
							Bénéficiaires
						</TableHead>
						<TableHead className="text-right">Montant</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{operations.map((operation) => (
						<OperationsRow
							key={operation.id}
							operation={operation}
							isArchived={isArchived}
							setSelectedOperation={setSelectedOperation}
							setIsOperationDialogOpen={setIsOperationDialogOpen}
						/>
					))}
				</TableBody>

				<TableFooter>
					{footerRows.map((row) => (
						<TableRow key={row.className} className={row.className}>
							<TableCell colSpan={row.colSpan} className="text-right">
								Total
							</TableCell>
							<TableCell className="text-right">
								{formattedTotalAmount}
							</TableCell>
						</TableRow>
					))}
				</TableFooter>
			</Table>
		</section>
	);
}
