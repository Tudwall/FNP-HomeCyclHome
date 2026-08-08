"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavItem = { href: string; label: string };

export function MobileNav({
	items,
	isAuthenticated,
}: {
	items: readonly NavItem[];
	isAuthenticated: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="md:hidden">
			<button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				aria-expanded={isOpen}
				aria-controls="mobile-menu"
				aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
				className="rounded-md p-2 text-navy hover:bg-surface-alt"
			>
				{isOpen ? <Menu size={22} /> : <X size={22} />}
			</button>

			{isOpen && (
				<div
					id="mobile-menu"
					className="absolute inset-x-0 top-16 border-b border-zinc-200 bg-white px-4 py-4 shadow-lg"
				>
					<nav aria-label="Navigation mobile" className="flex flex-col gap-4">
						{items.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsOpen(false)}
								className="text-sm font-medium text-navy"
							>
								{item.label}
							</Link>
						))}
						<Link
							href={isAuthenticated ? "/mon-compte" : "/login"}
							onClick={() => setIsOpen(false)}
							className="text-sm font-medium text-navy"
						>
							{isAuthenticated ? "Mon compte" : "Connexion"}
						</Link>
						<Link
							href="/reserver"
							onClick={() => setIsOpen(false)}
							className="rounded-md bg-brand px-5 py-2 text-center text-sm font-semibold text-white"
						>
							Réserver
						</Link>
					</nav>
				</div>
			)}
		</div>
	);
}
