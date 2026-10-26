import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { getMyBikes } from "@/lib/bikes";
import { AddBikeLink } from "@/components/bikes/add-bike-link";
import { BikeCard } from "@/components/bikes/bike-card";
import { EmptyBikes } from "@/components/bikes/empty-bikes";

export const metadata: Metadata = { title: "Mes vélos" };

export default async function BikesPage() {
	// Séquentiel : un 401 sur /bikes ne doit pas devancer la redirection.
	await requireUser();
	const bikes = await getMyBikes();

	return (
		<section>
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="font-heading text-2xl font-extrabold text-navy">
						Mes vélos
					</h1>
					{bikes.length > 0 && (
						<p className="mt-1 text-sm text-navy/70">
							{bikes.length} vélo{bikes.length > 1 ? "s" : ""} enregistré
							{bikes.length > 1 ? "s" : ""}
						</p>
					)}
				</div>
				{bikes.length > 0 && <AddBikeLink />}
			</div>

			{bikes.length === 0 ? (
				<EmptyBikes />
			) : (
				<ul className="mt-6 grid gap-4 sm:grid-cols-2">
					{bikes.map((bike) => (
						<li key={bike.id}>
							<BikeCard bike={bike} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
