import "server-only";
import { cache } from "react";
import { apiFetch, ApiError } from "./api";
import { redirect } from "next/navigation";

export type SessionUser = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
};

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
	try {
		return await apiFetch<SessionUser>("/auth/me");
	} catch (error) {
		if (error instanceof ApiError && error.status === 401) return null;
		throw error;
	}
});

export const getOptionalUser = cache(async (): Promise<SessionUser | null> => {
	try {
		return await getCurrentUser();
	} catch {
		return null;
	}
});

export async function requireUser(): Promise<SessionUser> {
	const user = await getCurrentUser();
	if (!user) redirect("/login");
	return user;
}
