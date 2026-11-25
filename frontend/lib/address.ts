import { cache } from "react";
import "server-only";
import { ApiError, apiFetch } from "./api";

export type Address = {
	id: number;
	number: string | null;
	street: string;
	postalCode: string;
	locality: string;
	country: string;
};

export const getMyAddress = cache(async (): Promise<Address | null> => {
	try {
		return await apiFetch<Address>("/address");
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) return null;
		throw error;
	}
});
