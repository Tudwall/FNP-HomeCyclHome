import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Adresse email invalide"),
	password: z.string().min(1, "Mot de passe requis"),
});

export const signupSchema = z
	.object({
		firstName: z.string().trim().min(1, "Prénom requis").max(100),
		lastName: z.string().trim().min(1, "Nom requis").max(100),
		email: z.email("Adresse email invalide"),
		password: z
			.string()
			.min(8, "8 caractères minimum")
			.max(72, "72 caractères maximum"),
		confirmPassword: z.string(),
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
