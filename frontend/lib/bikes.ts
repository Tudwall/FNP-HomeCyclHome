import "server-only";
import { cache } from "react";
import { apiFetch, ApiError } from "./api";
import type { BikeType } from "./catalog";

export type Bike = {
	id: number;
	createdOn: string;
	updatedOn: string | null;
	bikeModelId: number;
	typeId: number;
	bikeType: BikeType;
	bikeModel: {
		id: number;
		name: string;
		brandId: number;
		bikeBrand: { id: number; name: string };
	};
};

export const getMyBikes = cache(() => apiFetch<Bike[]>("/bikes"));

export const getBike = cache(async (id: number): Promise<Bike | null> => {
	try {
		return await apiFetch<Bike>(`/bikes/${id}`);
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) return null;
		throw error;
	}
});
