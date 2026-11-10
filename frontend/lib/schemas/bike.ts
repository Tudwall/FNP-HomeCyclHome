import { z } from "zod";

const selectedId = (message: string) =>
	z.coerce.number({ error: message }).int(message).positive(message);

export const bikeSchema = z.object({
	bikeModelId: selectedId("Choisissez un modèle"),
	typeId: selectedId("Choisissez un type de vélo"),
});

export type BikeInput = z.infer<typeof bikeSchema>;
