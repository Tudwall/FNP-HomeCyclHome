"use client";

import type { FormState } from "@/app/actions/auth";
import { updateProfileAction } from "@/app/actions/profile";
import { useActionState, useState } from "react";
import { Field } from "../ui/field";
import { SubmitButton } from "../ui/submit-button";
import { FormFeedback } from "../ui/form-feedback";

type ProfileFormProps = {
	defaultValues: { firstName: string; lastName: string };
};

const INITIAL_STATE: FormState = {};

export function ProfileForm({ defaultValues }: ProfileFormProps) {
	const [state, formAction] = useActionState(
		updateProfileAction,
		INITIAL_STATE,
	);
	const [firstName, setFirstName] = useState(defaultValues.firstName);
	const [lastName, setLastName] = useState(defaultValues.lastName);

	return (
		<form action={formAction} className="mt-6 space-y-6">
			<FormFeedback error={state.message} success={state.success} />

			<div className="grid gap-6 sm:grid-cols-2">
				<Field
					label="Prénom"
					name="firstName"
					autoComplete="given-name"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					maxLength={100}
					required
					errors={state.errors?.firstName}
				/>
				<Field
					label="Nom"
					name="lastName"
					autoComplete="family-name"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					maxLength={100}
					required
					errors={state.errors?.lastName}
				/>
			</div>

			<SubmitButton>Enregistrer</SubmitButton>
		</form>
	);
}
