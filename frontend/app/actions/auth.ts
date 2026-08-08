"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "@/lib/schemas/auth";
import { ApiError, apiFetch, apiLogin } from "@/lib/api";

export type FormState = {
	errors?: Record<string, string[] | undefined>;
	message?: string;
};

const COOKIE_MAX_AGE = 60 * 60;

async function startSession(token: string) {
	(await cookies()).set("access_token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: COOKIE_MAX_AGE,
		path: "/",
	});
}

function safeRedirectTarget(value: FormDataEntryValue | null) {
	const path = typeof value === "string" ? value : "";
	return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export async function loginAction(
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	const parsed = loginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});
	if (!parsed.success) {
		return { errors: z.flattenError(parsed.error).fieldErrors };
	}

	try {
		await startSession(await apiLogin(parsed.data));
	} catch (error) {
		if (error instanceof ApiError) {
			return {
				message:
					error.status === 401
						? "Email ou mot de passe incorrect."
						: "Connexion impossible pour le moment.",
			};
		}
		throw error;
	}

	redirect(safeRedirectTarget(formData.get("next")));
}

export async function signupAction(
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	const parsed = signupSchema.safeParse({
		firstName: formData.get("firstName"),
		lastName: formData.get("lastName"),
		email: formData.get("email"),
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword"),
	});
	if (!parsed.success) {
		return { errors: z.flattenError(parsed.error).fieldErrors };
	}

	const { confirmPassword: _ignored, ...payload } = parsed.data;

	try {
		await apiFetch("/auth/signup", {
			method: "POST",
			body: payload,
			auth: false,
		});
		await startSession(
			await apiLogin({ email: payload.email, password: payload.password }),
		);
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 409) {
				return { errors: { email: ["Un compte existe déjà avec cet email."] } };
			}
			return { message: error.messages.join(" ") };
		}
		throw error;
	}
	redirect("/");
}

export async function logoutAction() {
	try {
		await apiFetch("/auth/logout", { method: "POST" });
	} catch {}
	(await cookies()).delete("access_token");
	redirect("/");
}
