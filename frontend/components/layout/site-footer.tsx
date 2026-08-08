import { Logo } from "./logo";
import Link from "next/link";
import { BadgeCheck, Share2 } from "lucide-react";
import { SiInstagram } from "@icons-pack/react-simple-icons";

const COLUMNS = [
	{
		title: "Services",
		links: [
			{ href: "/#comment-ca-marche", label: "Comment ça marche" },
			{ href: "/tarifs", label: "Tarifs" },
			{ href: "/zones", label: "Zones d'interventions" },
		],
	},
	{
		title: "Légal",
		links: [
			{ href: "/contact", label: "Contact" },
			{ href: "/mentions-legales", label: "Mentions légales" },
		],
	},
] as const;

export function SiteFooter() {
	return (
		<footer className="bg-surface-alt">
			<div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
				<div className="space-y-4">
					<Logo />
					<p className="text-sm text-navy/70">
						© 2026 HomeCyclHome. Experts mécaniques à domicile
					</p>
					<div className="flex gap-4 text-navy/60">
						<Link href="#" aria-label="Instagram">
							<SiInstagram size={20} aria-hidden="true" />
						</Link>
						<Link href="#" aria-label="Partager">
							<Share2 size={20} aria-hidden="true" />
						</Link>
					</div>
				</div>

				{COLUMNS.map((column) => (
					<div key={column.title}>
						<h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-navy/50">
							{column.title}
						</h2>
						<ul className="space-y-2">
							{column.links.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-navy/80 transition-colors hover:text-brand"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
						{column.title === "Légal" && (
							<p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
								<BadgeCheck size={16} aria-hidden="true" />
								Certifié Pro-Velo 2026
							</p>
						)}
					</div>
				))}
			</div>
		</footer>
	);
}
