import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Adresse email invalide"),
	password: z.string().min(1, "Mot de passe requis"),
});

export const signupSchema = z
	.object({
		firstName: z
			.string()
			.trim()
			.min(1, "Prénom requis")
			.max(100, "100 caractères maximum"),
		lastName: z
			.string()
			.trim()
			.min(1, "Nom requis")
			.max(100, "100 caractères maximum"),
		email: z.email("Adresse email invalide").max(255, "255 caractères maximum"),
		password: z
			.string()
			.min(8, "8 caractères minimum")
			.max(72, "72 caractères maximum"),
		confirmPassword: z.string().min(1, "Confirmation requise"),
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
