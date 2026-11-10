import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Bike } from "@/lib/bikes";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
	dateStyle: "long",
	timeZone: "Europe/Paris",
});

export function BikeCard({ bike }: { bike: Bike }) {
	const { bikeModel, bikeType } = bike;

	return (
		<Link
			href={`/mon-compte/velos/${bike.id}`}
			className="group flex items-center justify-between gap-4 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
		>
			<div>
				<p className="font-heading font-bold text-navy">
					{bikeModel.bikeBrand.name} {bikeModel.name}
				</p>
				<p className="mt-1 text-sm text-navy/60">
					Ajouté le{" "}
					<time dateTime={bike.createdOn}>
						{dateFormat.format(new Date(bike.createdOn))}
					</time>
				</p>
				<span className="mt-3 inline-block rounded-sm bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
					{bikeType.name}
				</span>
			</div>
			<ChevronRight
				aria-hidden="true"
				className="shrink-0 text-navy/40 transition-colors group-hover:text-brand"
			/>
		</Link>
	);
}
