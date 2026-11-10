import "server-only";
import { cache } from "react";
import { apiFetch } from "./api";

export type BikeType = {
	id: number;
	name: string;
};

export type BikeModelOption = {
	id: number;
	name: string;
};

export type BikeBrand = {
	id: number;
	name: string;
	models: BikeModelOption[];
};

export const getBikeTypes = cache(() =>
	apiFetch<BikeType[]>("/catalog/bike-types"),
);

export const getBikeBrands = cache(() =>
	apiFetch<BikeBrand[]>("/catalog/bike-brands"),
);
