import type { IOperationParticipant } from "@/types/operations";
import type { IProjectParticipants } from "@/types/project";
import { getAvatarColor } from "@/utils/avatarColors";

type ParticipantStackProps = {
	participants: IProjectParticipants[] | IOperationParticipant[];
	size?: "sm" | "md";
	maxVisible?: number;
};

export function ParticipantStack({
	participants = [],
	maxVisible = 3,
	size = "sm",
}: ParticipantStackProps) {
	if (!participants) return null;

	const visibleParticipants = participants.slice(0, maxVisible);
	const remaining = participants.length - visibleParticipants.length;

	const sizeClasses = {
		sm: "size-6 text-[11px] flex items-center justify-center rounded-full border-2 border-background font-medium text-foreground",
		md: "size-9 text-xs flex items-center justify-center rounded-full border-2 border-background font-medium text-foreground",
	};

	return (
		<div className="flex items-center gap-2">
			<div className="flex -space-x-1.5">
				{visibleParticipants.map((p) => (
					<span
						key={p.participant.name}
						className={`${sizeClasses[size]} ${getAvatarColor(
							p.participant.name,
						)} text-white`}
					>
						{p.participant.name.slice(0, 2).toUpperCase()}
					</span>
				))}
				{remaining > 0 && (
					<span className={`${sizeClasses[size]} bg-muted border-border`}>
						+{remaining}
					</span>
				)}
			</div>
			<span className="text-xs text-muted-foreground">
				{participants.length}
			</span>
		</div>
	);
}
