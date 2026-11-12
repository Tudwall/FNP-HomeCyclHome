import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { ProfileForm } from "@/components/account/profile-form";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilePage() {
	const user = await requireUser();

	return (
		<section className="max-w-xl">
			<h1 className="font-heading text-2xl font-extrabold text-navy">
				Mon profil
			</h1>
			<div className="mt-6 bg-white p-6 shadow-sm">
				<h2 className="font-heading text-lg font-bold text-navy">
					Informations personnelles
				</h2>
				<ProfileForm
					defaultValues={{ firstName: user.firstName, lastName: user.lastName }}
				/>
			</div>

			<div className="mt-6 bg-white p-6 shadow-sm">
				<h2 className="font-heading text-lg font-bold text-navy">Email</h2>
				<p className="mt-2 font-medium">{user.email}</p>
			</div>
		</section>
	);
}
