import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { apiCreateProject, apiGetProjects } from "@/services/api";
import type { CreateProjectPayload } from "@/types/project";

// ── useProjectsQuery ──────────────────────────────────────────────────────────

export function useProjectsQuery() {
	return useInfiniteQuery({
		// Cache key — any component using ["projects"] shares the same cache
		queryKey: ["projects"],
		// Called for each page — pageParam is the cursor (undefined = first page)
		queryFn: ({ pageParam }) => apiGetProjects(pageParam),
		// First call has no cursor
		initialPageParam: undefined as number | undefined,
		// TanStack calls this after each page to determine the next cursor.
		// Returns undefined when there are no more pages (hasNextPage = false)
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
	});
}

// ── useCreateProjectMutation ──────────────────────────────────────────────────
// Sends a POST /api/projects request
// On success, invalidates the ["projects"] cache so the list
// automatically refetches and shows the newly created project
export function useCreateProjectMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateProjectPayload) => apiCreateProject(payload),
		onSuccess: () => {
			// Forces a fresh fetch of the projects list
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});
}
