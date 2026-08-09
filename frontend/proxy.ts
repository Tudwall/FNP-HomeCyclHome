import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/mon-compte"];
const GUEST_ONLY = ["/login", "/signup"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = request.cookies.has("access_token");

	if (!hasSession && PROTECTED.some((p) => pathname.startsWith(p))) {
		const url = new URL("/login", request.url);
		url.searchParams.set("next", pathname);
		return NextResponse.redirect(url);
	}

	if (hasSession && GUEST_ONLY.some((p) => pathname.startsWith(p))) {
		return NextResponse.redirect(new URL("/", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
