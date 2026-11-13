"use server";

import { getCurrentUser } from "@/lib/session";
import type { FormState } from "./auth";
import { redirect } from "next/navigation";
import { profileSchema } from "@/lib/schemas/profile";
import { ApiError, apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { changePasswordSchema } from "@/lib/schemas/auth";

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

export async function changePasswordAction(
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	const parsed = changePasswordSchema.safeParse({
		currentPassword: formData.get("currentPassword"),
		newPassword: formData.get("newPassword"),
		confirmPassword: formData.get("confirmPassword"),
	});
	if (!parsed.success) {
		return { errors: z.flattenError(parsed.error).fieldErrors };
	}

	const { currentPassword, newPassword } = parsed.data;

	try {
		await apiFetch("/auth/password", {
			method: "PATCH",
			body: { currentPassword, newPassword },
		});
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 401) redirect("/connexion");
			if (error.status === 403) {
				return {
					errors: { currentPassword: ["Mot de passe actuel incorrect."] },
				};
			}
			if (error.status === 429) {
				return { message: "Trop de tentatives. Réessayez dans une minute." };
			}
			return { message: "Impossible de modifier le mot de passe. Réessayez." };
		}
		throw error;
	}

	return { success: "Mot de passe modifié." };
}
