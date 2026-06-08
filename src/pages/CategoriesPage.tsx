import { ConnectedHeader } from "@/components/common/ConnectedHeader";
import { useCategories } from "@/context/CategoriesContext";

export function CategoriesPage() {
	const { categories } = useCategories();

	return (
		<>
			<ConnectedHeader />
			<main className="mx-auto max-w-5xl px-6 py-10">
				<h1 className="text-3xl font-bold mb-6">Categories</h1>
				{categories?.map((category) => (
					<div
						key={category.id}
						className="p-4 mb-4 rounded"
						style={{ backgroundColor: category.color }}
					>
						<h2 className="text-xl font-semibold">{category.name}</h2>
					</div>
				))}
			</main>
		</>
	);
}
