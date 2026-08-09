import Link from "next/link";
import { UserRound } from "lucide-react";
import { getOptionalUser } from "@/lib/session";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";
import { LogoutButton } from "./logout-button";

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
					{user ? (
						<div className="hidden items-center gap-4 md:flex">
							<Link
								href="/mon-compte"
								className="flex items-center gap-2 text-sm font-medium text-navy transition-colors hover:text-brand"
							>
								<UserRound size={20} aria-hidden="true" />
								{user.firstName}
							</Link>
							<LogoutButton className="rounded-md border border-navy/20 px-4 py-2 hover:border-brand" />
						</div>
					) : (
						<div className="hidden items-center gap-2 md:flex">
							<Link
								href="/login"
								className="rounded-md px-4 py-2 text-sm font-medium text-navy transition-colors hover:text-brand"
							>
								Se connecter
							</Link>
							<Link
								href="/signup"
								className="rounded-md border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
							>
								Créer un compte
							</Link>
						</div>
					)}
					<MobileNav items={NAV_ITEMS} isAuthenticated={Boolean(user)} />
				</div>
			</div>
		</header>
	);
}
