"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { loginAction, type FormState } from "@/app/actions/auth";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormFeedback } from "@/components/ui/form-feedback";

const INITIAL_STATE: FormState = {};

export function LoginForm({ next }: { next?: string }) {
	const [state, formAction] = useActionState(loginAction, INITIAL_STATE);

	return (
		<form action={formAction} className="mt-8 space-y-6">
			{next && <input type="hidden" name="next" value={next} />}

			<FormFeedback error={state.message} />

			<Field
				label="Adresse e-mail"
				name="email"
				type="email"
				icon={Mail}
				placeholder="jean.dupont@exemple.com"
				autoComplete="email"
				required
				errors={state.errors?.email}
			/>

			<PasswordField
				label="Mot de passe"
				name="password"
				placeholder="••••••••"
				autoComplete="current-password"
				required
				errors={state.errors?.password}
				action={
					<Link
						href="/mot-de-passe-oublie"
						className="text-xs font-medium text-brand hover:underline"
					>
						Mot de passe oublié ?
					</Link>
				}
			/>

			<SubmitButton>Se connecter</SubmitButton>
		</form>
	);
}
