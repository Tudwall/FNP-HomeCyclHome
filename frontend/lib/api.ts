import "server-only";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;
if (!API_URL) throw new Error("API_URL manquante");

export class ApiError extends Error {
	constructor(
		readonly status: number,
		readonly messages: string[],
	) {
		super(messages[0] ?? "Erreur inattendue");
		this.name = "ApiError";
	}
}

type Options = Omit<RequestInit, "body"> & {
	body?: unknown;
	auth?: boolean;
};

async function request(
	path: string,
	{ body, auth = true, headers, ...init }: Options = {},
) {
	const h = new Headers(headers);
	if (body !== undefined) h.set("Content-Type", "application/json");
	if (auth) {
		const token = (await cookies()).get("access_token")?.value;
		if (token) h.set("Cookie", `access_token=${token}`);
	}

	const res = await fetch(`${API_URL}${path}`, {
		cache: "no-store",
		...init,
		headers: h,
		body: body === undefined ? undefined : JSON.stringify(body),
	});

	if (!res.ok) {
		const payload = (await res.json().catch(() => null)) as {
			message?: string | string[];
		} | null;
		const raw = payload?.message;
		throw new ApiError(
			res.status,
			Array.isArray(raw) ? raw : [raw ?? res.statusText],
		);
	}
	return res;
}

export async function apiFetch<T>(path: string, options?: Options): Promise<T> {
	const res = await request(path, options);
	return res.status === 204 ? (null as T) : ((await res.json()) as T);
}

export async function apiLogin(credentials: {
	email: string;
	password: string;
}) {
	const res = await request("/auth/login", {
		method: "POST",
		body: credentials,
		auth: false,
	});
	for (const raw of res.headers.getSetCookie()) {
		const [name, ...value] = raw.split(";")[0].split("=");
		if (name.trim() === "access_token") return value.join("=").trim();
	}
	throw new ApiError(502, ["Le serveur n'a pas renvoyé de session."]);
}
