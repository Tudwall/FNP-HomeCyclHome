import type { Metadata } from "next";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Mes vélos" };

export default async function BikesPage() {
	await requireUser();

	return (
		<section>
			<h1 className="font-heading text-2xl font-extrabold text-navy">
				Mes vélos
			</h1>
		</section>
	);
}
