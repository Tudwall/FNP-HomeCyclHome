import Link from "next/link";
import { UserRound } from "lucide-react";
import { getOptionalUser } from "@/lib/session";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";

const NAV_ITEMS = [
	{ href: "/", label: "Accueil" },
	{ href: "/services", label: "Services" },
	{ href: "/mon-compte", label: "Profil" },
] as const;

export async function SiteHeader() {
	const user = await getOptionalUser();

	return (
		<header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
				<Link href="/">
					<Logo />
				</Link>

				<nav
					aria-label="Navigation principale"
					className="hidden items-center gap-8 md:flex"
				>
					{NAV_ITEMS.map((item) => (
						<NavLink key={item.href} href={item.href}>
							{item.label}
						</NavLink>
					))}
					<Link
						href="/reserver"
						className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
					>
						Réserver
					</Link>
				</nav>

				<div className="flex items-center gap-2">
					<Link
						href={user ? "/mon-compte" : "/login"}
						aria-label={user ? "Mon compte" : "Se connecter"}
						className="hidden rounded-full p-2 text-navy transition-colors hover:bg-surface-alt hover:text-brand md:block"
					>
						<UserRound size={22} aria-hidden="true" />
					</Link>
					<MobileNav items={NAV_ITEMS} isAuthenticated={Boolean(user)} />
				</div>
			</div>
		</header>
	);
}
