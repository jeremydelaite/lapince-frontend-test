import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

type ResultStatus = "idle" | "loading" | "success" | "error";

const SUBJECTS = [
	{ value: "bug", label: "Signaler un bug" },
	{ value: "question", label: "Question" },
	{ value: "suggestion", label: "Suggestion" },
	{ value: "partenariat", label: "Partenariat" },
	{ value: "autre", label: "Autre" },
];

export default function ContactForm() {
	const [status, setStatus] = useState<ResultStatus>("idle");
	const [charCount, setCharCount] = useState(0);

	const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		setStatus("loading");

		const formData = new FormData(event.currentTarget);
		formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
		const response = await fetch("https://api.web3forms.com/submit", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		setStatus(data.success ? "success" : "error");

		if (data.success) {
			(event.target as HTMLFormElement).reset();
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-lg">
				<Link
					to="/"
					className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" />
					Retour à l'accueil
				</Link>
				<div className="bg-card rounded-2xl shadow-sm p-8">
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-bold text-foreground">
							Nous contacter
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Une question, un bug, une idée ?
						</p>
					</div>

					<form onSubmit={onSubmit} className="space-y-5">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-foreground mb-1"
							>
								Nom
							</label>
							<input
								id="name"
								type="text"
								name="name"
								placeholder="Jean Lapince"
								required
								className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
							/>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-foreground mb-1"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								name="email"
								placeholder="lapince@lapince.fr"
								required
								className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
							/>
						</div>

						<div>
							<label
								htmlFor="subject"
								className="block text-sm font-medium text-foreground mb-1"
							>
								Objet
							</label>
							<select
								id="subject"
								name="subject"
								required
								defaultValue=""
								className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
							>
								<option value="" disabled>
									-- Choisir un objet --
								</option>
								{SUBJECTS.map((s) => (
									<option key={s.value} value={s.value}>
										{s.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label
								htmlFor="message"
								className="block text-sm font-medium text-foreground mb-1"
							>
								Message
							</label>
							<textarea
								id="message"
								name="message"
								rows={5}
								placeholder="Décrivez votre demande..."
								required
								minLength={20}
								maxLength={1000}
								onChange={(e) => setCharCount(e.target.value.length)}
								className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition resize-none"
							/>
							<p
								className={`text-xs mt-1 text-right ${charCount < 20 ? "text-red-400" : "text-muted-foreground"}`}
							>
								{charCount} / 1000 {charCount < 20 && `(minimum 20 caractères)`}
							</p>
						</div>

						<button
							type="submit"
							disabled={status === "loading"}
							className="w-full rounded-lg bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-900 font-semibold py-2.5 text-sm transition"
						>
							{status === "loading"
								? "Envoi en cours..."
								: "Envoyer le message"}
						</button>

						{status === "success" && (
							<p className="text-center text-sm text-green-600 font-medium">
								✓ Message envoyé avec succès !
							</p>
						)}
						{status === "error" && (
							<p className="text-center text-sm text-red-500 font-medium">
								Une erreur est survenue. Veuillez réessayer.
							</p>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
