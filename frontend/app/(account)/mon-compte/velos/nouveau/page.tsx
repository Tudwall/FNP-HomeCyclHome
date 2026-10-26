import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getBikeBrands, getBikeTypes } from "@/lib/catalog";
import { createBikeAction } from "@/app/actions/bikes";
import { BikeForm } from "@/components/bikes/bike-form";

export const metadata: Metadata = { title: "Ajouter un vélo" };

export default async function NewBikePage() {
	await requireUser();
	const [brands, types] = await Promise.all([getBikeBrands(), getBikeTypes()]);

	return (
		<section className="max-w-xl">
			<Link
				href="/mon-compte/velos"
				className="inline-flex items-center gap-1 text-sm text-navy/70 transition-colors hover:text-brand"
			>
				<ArrowLeft size={16} aria-hidden="true" />
				Mes vélos
			</Link>
			<h1 className="mt-4 font-heading text-2xl font-extrabold text-navy">
				Ajouter un vélo
			</h1>
			<BikeForm
				action={createBikeAction}
				brands={brands}
				types={types}
				submitLabel="Ajouter le vélo"
			/>
		</section>
	);
}
