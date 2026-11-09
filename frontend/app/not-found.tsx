import { SiteHeader } from "@/components/layout/site-header";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page introuvable" };

export default function NotFound() {
	return (
		<>
			<SiteHeader />
			<main className="flex flex-1 items-center justify-center bg-surface px-4 py-20">
				<div className="max-w-md text-center">
					<p className="font-heading text-6xl font-extrabold text-brand">404</p>
					<h1 className="mt-4 font-heading text-2xl font-extrabold text-navy">
						Page introuvable
					</h1>
					<p className="mt-2 text-sm text-navy/70">
						Cette page n'existe pas ou a été déplacée.
					</p>
					<Link
						href="/"
						className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors"
					>
						<ArrowLeft size={16} aria-hidden="true" />
						Retour à l'accueil
					</Link>
				</div>
			</main>
		</>
	);
}
