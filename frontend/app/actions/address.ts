"use server";

import { addressSchema } from "@/lib/schemas/address";
import type { FormState } from "./auth";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function replaceAddressAction(
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	const parsed = addressSchema.safeParse({
		number: formData.get("number"),
		street: formData.get("street"),
		postalCode: formData.get("postalCode"),
		locality: formData.get("locality"),
	});
	if (!parsed.success) {
		return { errors: z.flattenError(parsed.error).fieldErrors };
	}

	try {
		await apiFetch("/address", { method: "PUT", body: parsed.data });
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 401) redirect("/connexion");
			return { message: "Impossible d'enregistrer votre adresse. Réessayez." };
		}
		throw error;
	}

	revalidatePath("/mon-compte");
	return { success: "Adresse enregistrée." };
}
