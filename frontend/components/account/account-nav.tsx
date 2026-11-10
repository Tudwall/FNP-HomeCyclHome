"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, UserRound } from "lucide-react";

const ITEMS = [
	{ href: "/mon-compte", label: "Profil", icon: UserRound, exact: true },
	{ href: "/mon-compte/velos", label: "Mes vélos", icon: Bike, exact: false },
] as const;

export function AccountNav() {
	const pathname = usePathname();

	return (
		<nav aria-label="Espace client" className="flex gap-2 md:flex-col">
			{ITEMS.map(({ href, label, icon: Icon, exact }) => {
				const isActive = exact
					? pathname === href
					: pathname.startsWith(href);

				return (
					<Link
						key={href}
						href={href}
						aria-current={isActive ? "page" : undefined}
						className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
							isActive
								? "bg-brand-soft text-brand"
								: "text-navy hover:bg-surface-alt"
						}`}
					>
						<Icon size={18} aria-hidden="true" />
						{label}
					</Link>
				);
			})}
		</nav>
	);
}
