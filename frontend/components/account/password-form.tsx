"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/auth";
import { changePasswordAction } from "@/app/actions/profile";
import { PasswordField } from "@/components/ui/password-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormFeedback } from "../ui/form-feedback";

const INITIAL_STATE: FormState = {};

export function PasswordForm() {
	const [state, formAction] = useActionState(
		changePasswordAction,
		INITIAL_STATE,
	);

	return (
		<form action={formAction} className="mt-6 space-y-6">
			<FormFeedback error={state.message} success={state.success} />

			<PasswordField
				label="Mot de passe actuel"
				name="currentPassword"
				autoComplete="current-password"
				maxLength={72}
				required
				errors={state.errors?.currentPassword}
			/>
			<PasswordField
				label="Nouveau mot de passe"
				name="newPassword"
				autoComplete="new-password"
				minLength={8}
				maxLength={72}
				required
				errors={state.errors?.newPassword}
			/>
			<PasswordField
				label="Confirmer le nouveau mot de passe"
				name="confirmPassword"
				autoComplete="new-password"
				maxLength={72}
				required
				errors={state.errors?.confirmPassword}
			/>

			<SubmitButton>Modifier le mot de passe</SubmitButton>
		</form>
	);
}
