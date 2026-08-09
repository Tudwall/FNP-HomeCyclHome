"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

	return (
		<Link
			href={href}
			aria-current={isActive ? "page" : undefined}
			className={`text-sm font-medium transition-colors ${
				isActive ? "text-brand" : "text-navy hover:text-brand"
			}`}
		>
			{children}
		</Link>
	);
}
