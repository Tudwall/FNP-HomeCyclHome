import { z } from "zod";
import { profileSchema } from "./profile";

export const loginSchema = z.object({
	email: z.email("Adresse email invalide"),
	password: z.string().min(1, "Mot de passe requis"),
});

export const passwordSchema = z
	.string()
	.min(8, "8 caractères minimum")
	.max(72, "72 caractères maximum");

export const changePasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(1, "Mot de passe actuel requis")
			.max(72, "72 caractères maximum"),
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Confirmation requise"),
	})
	.refine((d) => d.newPassword === d.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	})
	.refine((d) => d.newPassword !== d.currentPassword, {
		message: "Le nouveau mot de passe doit être différent de l'actuel",
		path: ["newPassword"],
	});

export const signupSchema = profileSchema
	.extend({
		email: z.email("Adresse email invalide").max(255, "255 caractères maximum"),
		password: passwordSchema,
		confirmPassword: z.string().min(1, "Confirmation requise"),
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	});
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
