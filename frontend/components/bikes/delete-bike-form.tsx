"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";

export function DeleteBikeForm({ action }: { action: () => Promise<void> }) {
	return (
		<form
			action={action}
			onSubmit={(e) => {
				if (
					!window.confirm("Supprimer ce vélo ? Cette action est définitive.")
				) {
					e.preventDefault();
				}
			}}
			className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-red-200 bg-white p-6"
		>
			<div>
				<p className="font-heading font-bold text-navy">Supprimer ce vélo</p>
				<p className="mt-1 text-sm text-navy/60">
					Il n&apos;apparaitra plus dans la liste de vos vélos.
				</p>
			</div>
			<DeleteButton />
		</form>
	);
}

function DeleteButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="inline-flex items-center gap-2 rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
		>
			<Trash2 size={16} aria-hidden="true" />
			{pending ? "Suppression..." : "Supprimer"}
		</button>
	);
}
