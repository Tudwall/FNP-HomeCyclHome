import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BikeNotFound() {
	return (
		<section className="max-w-xl">
			<h1 className="font-heading text-2xl font-extrabold text-navy">
				Vélo introuvable
			</h1>
			<p className="mt-2 text-sm text-navy/70">
				Ce vélo n&apos;existe pas ou a été supprimé.
			</p>
			<Link
				href="/mon-compte/velos"
				className="mt-6 inline-flex items-center gap-1 text-sm text-navy/70 transition-colors hover:text-brand"
			>
				<ArrowLeft size={16} aria-hidden="true" />
				Mes vélos
			</Link>
		</section>
	);
}
