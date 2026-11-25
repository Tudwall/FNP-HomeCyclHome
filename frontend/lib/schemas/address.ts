import { z } from "zod";

export const addressSchema = z.object({
	number: z
		.string()
		.trim()
		.max(50, "50 caractères maximum")
		.transform((v) => v || undefined),
	street: z
		.string()
		.trim()
		.min(1, "Rue requise")
		.max(150, "150 caractères maximum"),
	postalCode: z
		.string()
		.trim()
		.regex(/^\d{5}$/, "Code postal à 5 chiffres"),
	locality: z
		.string()
		.trim()
		.min(1, "Ville requise")
		.max(100, "100 caractères maximum"),
});

export type AddressInput = z.input<typeof addressSchema>;
