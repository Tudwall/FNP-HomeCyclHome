"use client";

import { RotateCw } from "lucide-react";
import Link from "next/link";

type ErrorFallbackProps = {
	error: Error & { digest?: string };
	unstable_retry: () => void;
};

export function ErrorFallback({ error, unstable_retry }: ErrorFallbackProps) {
	return (
		<div className="flex flex-1 items-center justify-center bg-surface px-4 py-20">
			<div className="max-w-md text-center">
				<p className="font-heading text-6xl font-extrabold text-brand">Oups</p>
				<h1 className="mt-4 font-heading text-2xl font-extrabold text-navy">
					Une erreur est survenue
				</h1>
				<p className="mt-2 text-sm text-navy/70">
					Le service est momentanément indisponible. Réessayez dans quelques
					instants.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<button
						type="button"
						onClick={() => unstable_retry()}
						className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors"
					>
						<RotateCw size={16} aria-hidden="true" />
						Réessayer
					</button>
					<Link
						href="/"
						className="inline-flex items-center rounded-md border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-brand hover:text-brand"
					>
						Retour à l'accueil
					</Link>
				</div>
				{error.digest && (
					<p className="mt-6 text-xs text-navy/40">Référence: {error.digest}</p>
				)}
			</div>
		</div>
	);
}
