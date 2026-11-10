import { deleteBikeAction, updateBikeAction } from "@/app/actions/bikes";
import { BikeForm } from "@/components/bikes/bike-form";
import { DeleteBikeForm } from "@/components/bikes/delete-bike-form";
import { getBike } from "@/lib/bikes";
import { getBikeBrands, getBikeTypes } from "@/lib/catalog";
import { requireUser } from "@/lib/session";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Modifier un vélo" };

export default async function BikePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await requireUser();
	const id = Number((await params).id);
	if (!Number.isInteger(id) || id <= 0) notFound();

	const [bike, brands, types] = await Promise.all([
		getBike(id),
		getBikeBrands(),
		getBikeTypes(),
	]);
	if (!bike) notFound();

	const { bikeModel } = bike;

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
				{bikeModel.bikeBrand.name} {bikeModel.name}
			</h1>
			<BikeForm
				action={updateBikeAction.bind(null, bike.id)}
				brands={brands}
				types={types}
				submitLabel="Enregistrer les modifications"
				defaultValues={{
					brandId: bikeModel.brandId,
					bikeModelId: bike.bikeModelId,
					typeId: bike.typeId,
				}}
			/>
			<DeleteBikeForm action={deleteBikeAction.bind(null, bike.id)} />
		</section>
	);
}
