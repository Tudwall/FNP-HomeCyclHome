"use client";

import type { FormState } from "@/app/actions/auth";
import { deleteAccountAction } from "@/app/actions/profile";
import { useActionState } from "react";
import { FormFeedback } from "@/components/ui/form-feedback";
import { PasswordField } from "@/components/ui/password-field";
import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";

const INITIAL_STATE: FormState = {};

export function DeleteAccountForm() {
	const [state, formAction] = useActionState(
		deleteAccountAction,
		INITIAL_STATE,
	);

	return (
		<form
			action={formAction}
			onSubmit={(e) => {
				if (
					!window.confirm(
						"Supprimer votre compte ? Vous serez déconnecté et ne pourrez plus vous reconnecter.",
					)
				) {
					e.preventDefault();
				}
			}}
			className="my-6 space-y-6 border border-red-200 bg-white p-6"
		>
			<div>
				<h2 className="font-heading text-lg font-bold text-navy">
					Supprimer mon compte
				</h2>
				<p className="mt-1 text-sm text-navy/60">
					Vous serez déconnecté et ne pourrez plus accéder à votre espace ni à
					vos vélos.
				</p>
			</div>

			<FormFeedback error={state.message} />

			<PasswordField
				label="Mot de passe"
				name="password"
				autoComplete="current-password"
				maxLength={72}
				required
				errors={state.errors?.password}
			/>

			<DeleteButton />
		</form>
	);
}

function DeleteButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="inline-flex items-center gap-2 rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
		>
			<Trash2 size={16} aria-hidden="true" />
			{pending ? "Suppression..." : "Supprimer mon compte"}
		</button>
	);
}
