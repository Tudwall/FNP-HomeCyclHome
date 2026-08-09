import type { Metadata } from "next";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Créer un compte" };

export default function SignupPage() {
	return (
		<>
			<h1 className="font-heading text-3xl font-extrabold text-navy">
				Créer un compte
			</h1>
			<p className="mt-2 text-sm leading-relaxed text-navy/70">
				Réparation de vélo professionnelle à domicile à Lyon.
			</p>

			<SignupForm />

			<hr className="my-7 border-zinc-200" />

			<p className="text-center text-sm text-navy/70">
				Vous avez déjà un compte ?
			</p>
			<p className="mt-2 text-center">
				<Link
					href="/login"
					className="inline-flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-brand"
				>
					Se connecter
					<LogIn size={16} aria-hidden="true" />
				</Link>
			</p>
		</>
	);
}
