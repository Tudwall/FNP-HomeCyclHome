import Link from "next/link";
import { Plus } from "lucide-react";

export function AddBikeLink() {
	return (
		<Link
			href="/mon-compte/velos/nouveau"
			className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
		>
			<Plus size={18} aria-hidden="true" />
			Ajouter un vélo
		</Link>
	);
}
