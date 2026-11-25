"use client";

import { replaceAddressAction } from "@/app/actions/address";
import type { FormState } from "@/app/actions/auth";
import type { AddressInput } from "@/lib/schemas/address";
import { type ChangeEvent, useActionState, useState } from "react";
import { FormFeedback } from "../ui/form-feedback";
import { Field } from "../ui/field";
import { SubmitButton } from "../ui/submit-button";

const INITIAL_STATE: FormState = {};

export function AddressForm({
	defaultValues,
}: {
	readonly defaultValues: AddressInput;
}) {
	const [state, formAction] = useActionState(
		replaceAddressAction,
		INITIAL_STATE,
	);
	const [values, setValues] = useState(defaultValues);

	const bind = (name: keyof AddressInput) => ({
		name,
		value: values[name] ?? "",
		onChange: (e: ChangeEvent<HTMLInputElement>) =>
			setValues((v) => ({ ...v, [name]: e.target.value })),
		errors: state.errors?.[name],
	});

	return (
		<form action={formAction} className="mt-6 space-y-6">
			<FormFeedback error={state.message} success={state.success} />

			<div className="grid gap-6 sm:grid-cols-[120px_1fr]">
				<Field label="N°" maxLength={50} {...bind("number")} />
				<Field
					label="Rue"
					autoComplete="address-line1"
					maxLength={150}
					required
					{...bind("street")}
				/>
			</div>
			<div className="grid gap-6 sm:grid-cols-[160px_1fr]">
				<Field
					label="Code postal"
					autoComplete="postal-code"
					inputMode="numeric"
					pattern="\d{5}"
					maxLength={5}
					required
					{...bind("postalCode")}
				/>
				<Field
					label="Ville"
					autoComplete="address-level2"
					maxLength={100}
					required
					{...bind("locality")}
				/>
			</div>

			<SubmitButton>Enregistrer</SubmitButton>
		</form>
	);
}
