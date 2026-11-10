"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/app/actions/auth";
import type { BikeBrand, BikeType } from "@/lib/catalog";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";

type BikeFormProps = {
	action: (prev: FormState, formData: FormData) => Promise<FormState>;
	brands: BikeBrand[];
	types: BikeType[];
	submitLabel: string;
	defaultValues?: { brandId: number; bikeModelId: number; typeId: number };
};

const INITIAL_STATE: FormState = {};

export function BikeForm({
	action,
	brands,
	types,
	submitLabel,
	defaultValues,
}: BikeFormProps) {
	const [state, formAction] = useActionState(action, INITIAL_STATE);
	const [brandId, setBrandId] = useState(String(defaultValues?.brandId ?? ""));
	const [bikeModelId, setBikeModelId] = useState(
		String(defaultValues?.bikeModelId ?? ""),
	);
	const [typeId, setTypeId] = useState(String(defaultValues?.typeId ?? ""));

	const models = brands.find((b) => String(b.id) === brandId)?.models ?? [];

	return (
		<form action={formAction} className="mt-6 space-y-6 bg-white p-6 shadow-sm">
			{state.message && (
				<p
					role="alert"
					className="rounded-sm bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
				>
					{state.message}
				</p>
			)}

			<SelectField
				id="brandId"
				label="Marque"
				placeholder="Choisissez une marque"
				options={brands.map((b) => ({ value: b.id, label: b.name }))}
				value={brandId}
				onChange={(e) => {
					setBrandId(e.target.value);
					setBikeModelId("");
				}}
				required
			/>

			<SelectField
				id="bikeModelId"
				name="bikeModelId"
				label="Modèle"
				placeholder={
					brandId ? "Choisissez un modèle" : "Choisissez d'abord une marque"
				}
				options={models.map((m) => ({ value: m.id, label: m.name }))}
				value={bikeModelId}
				onChange={(e) => setBikeModelId(e.target.value)}
				disabled={!brandId}
				required
				errors={state.errors?.bikeModelId}
			/>

			<SelectField
				id="typeId"
				name="typeId"
				label="Type de vélo"
				placeholder="Choisissez un type"
				options={types.map((t) => ({ value: t.id, label: t.name }))}
				value={typeId}
				onChange={(e) => setTypeId(e.target.value)}
				required
				errors={state.errors?.typeId}
			/>

			<SubmitButton>{submitLabel}</SubmitButton>
		</form>
	);
}
