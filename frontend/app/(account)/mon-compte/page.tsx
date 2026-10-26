import type { Metadata } from "next";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilePage() {
	const user = await requireUser();

	return (
		<section>
			<h1 className="font-heading text-2xl font-extrabold text-navy">
				Mon profil
			</h1>
			<dl className="mt-6 grid gap-6 bg-white p-6 shadow-sm sm:grid-cols-2">
				<div>
					<dt className="text-sm text-navy/60">Prénom</dt>
					<dd className="mt-1 font-medium">{user.firstName}</dd>
				</div>
				<div>
					<dt className="text-sm text-navy/60">Nom</dt>
					<dd className="mt-1 font-medium">{user.lastName}</dd>
				</div>
				<div className="sm:col-span-2">
					<dt className="text-sm text-navy/60">Email</dt>
					<dd className="mt-1 font-medium">{user.email}</dd>
				</div>
			</dl>
		</section>
	);
}
