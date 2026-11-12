"use server";

import { getCurrentUser } from "@/lib/session";
import type { FormState } from "./auth";
import { redirect } from "next/navigation";
import { profileSchema } from "@/lib/schemas/profile";
import { ApiError, apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProfileAction(
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	const user = await getCurrentUser();
	if (!user) redirect("/connexion");

	const parsed = profileSchema.safeParse({
		firstName: formData.get("firstName"),
		lastName: formData.get("lastName"),
	});
	if (!parsed.success) {
		return { errors: z.flattenError(parsed.error).fieldErrors };
	}

	try {
		await apiFetch(`/users/${user.id}`, { method: "PATCH", body: parsed.data });
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 401) redirect("/connexion");
			return { message: "Impossible d'enregistrer votre profil. Réessayez." };
		}
		throw error;
	}
	revalidatePath("/", "layout");
	return { success: "Profil mis à jour." };
}
