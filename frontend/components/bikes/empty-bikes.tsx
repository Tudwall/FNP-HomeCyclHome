import { Bike as BikeIcon } from "lucide-react";
import { AddBikeLink } from "./add-bike-link";

export function EmptyBikes() {
	return (
		<div className="mt-6 flex flex-col items-center bg-white px-6 py-12 text-center shadow-sm">
			<BikeIcon size={40} aria-hidden="true" className="text-brand" />
			<h2 className="mt-4 font-heading text-lg font-bold text-navy">
				Aucun vélo enregistré
			</h2>
			<p className="mt-2 max-w-sm text-sm text-navy/70">
				Ajoutez votre vélo pour pouvoir réserver une intervention à domicile.
			</p>
			<div className="mt-6">
				<AddBikeLink />
			</div>
		</div>
	);
}
