import { z } from "zod";

export const profileSchema = z.object({
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
});

export type ProfileInput = z.infer<typeof profileSchema>;
