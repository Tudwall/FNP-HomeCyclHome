"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api";
import { bikeSchema } from "@/lib/schemas/bike";
import type { FormState } from "./auth";

function parseBike(formData: FormData) {
	return bikeSchema.safeParse({
		bikeModelId: formData.get("bikeModelId"),
		typeId: formData.get("typeId"),
	});
}

async function saveBike(
	path: string,
	method: "POST" | "PATCH",
	formData: FormData,
): Promise<FormState> {
	const parsed = parseBike(formData);
	if (!parsed.success) {
		return { errors: z.flattenError(parsed.error).fieldErrors };
	}

	try {
		await apiFetch(path, { method, body: parsed.data });
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 401) redirect("/connexion");
			return {
				message:
					"Impossible d'enregistrer ce vélo. Vérifiez votre sélection et réessayez.",
			};
		}
		throw error;
	}

	revalidatePath("/mon-compte/velos");
	redirect("/mon-compte/velos");
}

export async function createBikeAction(
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	return saveBike("/bikes", "POST", formData);
}

export async function updateBikeAction(
	id: number,
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	return saveBike(`/bikes/${id}`, "PATCH", formData);
}

export async function deleteBikeAction(id: number) {
	try {
		await apiFetch(`/bikes/${id}`, { method: "DELETE" });
	} catch (error) {
		if (error instanceof ApiError && error.status === 401)
			redirect("/connexion");
		if (!(error instanceof ApiError && error.status === 404)) throw error;
	}

	revalidatePath("/mon-compte/velos");
	redirect("/mon-compte/velos");
}
