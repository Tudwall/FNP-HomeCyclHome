import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ next?: string }>;
}) {
	const { next } = await searchParams;

	return (
		<>
			<h1 className="text-center font-heading text-2xl font-extrabold text-navy">
				Connexion
			</h1>
			<p className="mt-2 text-center text-sm leading-relaxed text-navy/70">
				Saisissez vos identifiants pour accéder à votre compte.
			</p>

			<LoginForm next={next} />

			<hr className="my-7 border-zinc-200" />

			<p className="text-center text-sm text-navy/70">
				Vous n&apos;avez pas encore de compte ?{" "}
				<Link
					href="/signup"
					className="font-medium text-navy underline underline-offset-2 hover:text-brand"
				>
					Créer un compte
				</Link>
			</p>
		</>
	);
}
