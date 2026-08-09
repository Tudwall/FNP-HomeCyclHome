"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, User } from "lucide-react";
import { signupAction, type FormState } from "@/app/actions/auth";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";

const INITIAL_STATE: FormState = {};

export function SignupForm() {
	const [state, formAction] = useActionState(signupAction, INITIAL_STATE);

	return (
		<form action={formAction} className="mt-8 space-y-6">
			{state.message && (
				<p
					role="alert"
					className="rounded-sm bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
				>
					{state.message}
				</p>
			)}

			<div className="grid gap-6 sm:grid-cols-2">
				<Field
					label="Prénom"
					name="firstName"
					icon={User}
					placeholder="Jean"
					autoComplete="given-name"
					maxLength={100}
					required
					errors={state.errors?.firstName}
				/>
				<Field
					label="Nom"
					name="lastName"
					icon={User}
					placeholder="Dupont"
					autoComplete="family-name"
					maxLength={100}
					required
					errors={state.errors?.lastName}
				/>
			</div>

			<Field
				label="Adresse e-mail"
				name="email"
				type="email"
				icon={Mail}
				placeholder="jean.dupont@exemple.fr"
				autoComplete="email"
				maxLength={255}
				required
				errors={state.errors?.email}
			/>

			<PasswordField
				label="Mot de passe"
				name="password"
				placeholder="••••••••"
				autoComplete="new-password"
				minLength={8}
				required
				errors={state.errors?.password}
			/>

			<PasswordField
				label="Confirmer le mot de passe"
				name="confirmPassword"
				placeholder="••••••••"
				autoComplete="new-password"
				required
				errors={state.errors?.confirmPassword}
			/>

			<div className="flex items-start gap-3">
				<input
					id="terms"
					name="terms"
					type="checkbox"
					required
					className="mt-0.5 size-4 shrink-0 accent-brand"
				/>
				<label htmlFor="terms" className="text-xs leading-relaxed text-navy/80">
					J&apos;accepte les{" "}
					<Link
						href="/conditions"
						className="font-semibold text-navy hover:text-brand"
					>
						Conditions d&apos;utilisation
					</Link>{" "}
					et la{" "}
					<Link
						href="/confidentialite"
						className="font-semibold text-navy hover:text-brand"
					>
						Politique de confidentialité
					</Link>
					.
				</label>
			</div>

			<SubmitButton>S&apos;inscrire</SubmitButton>
		</form>
	);
}
