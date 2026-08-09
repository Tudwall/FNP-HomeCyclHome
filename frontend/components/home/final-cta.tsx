import Image from "next/image";
import Link from "next/link";
import mapLyon from "@/assets/map-lyon.jpg";

export function FinalCta() {
	return (
		<section
			aria-labelledby="final-cta-title"
			className="relative isolate flex min-h-[420px] items-center justify-center overflow-hidden"
		>
			<Image
				src={mapLyon}
				alt=""
				fill
				sizes="100vw"
				className="-z-10 object-cover grayscale"
			/>
			<div className="mx-4 w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
				<h2
					id="final-cta-title"
					className="font-heading text-2xl font-extrabold text-navy"
				>
					Prêt à rouler de nouveau ?
				</h2>
				<p className="mt-3 text-sm leading-relaxed text-navy/70">
					Intervention disponible dès demain dans toute la métropole de Lyon.
				</p>
				<Link
					href="/reserver"
					className="mt-6 block rounded-md bg-brand px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-hover"
				>
					Réserver maintenant
				</Link>
			</div>
		</section>
	);
}
