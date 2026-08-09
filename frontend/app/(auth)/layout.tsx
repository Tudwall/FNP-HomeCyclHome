import Image from "next/image";
import Link from "next/link";
import authBackground from "@/assets/hero.jpg";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="relative isolate flex min-h-screen flex-col">
			<Image
				src={authBackground}
				alt=""
				fill
				priority
				sizes="100vw"
				className="-z-20 object-cover"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-white/85 backdrop-blur-sm"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-0 h-1 bg-brand"
			/>

			<main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
				<Link href="/" className="mb-10">
					<Logo tone="navy" className="text-3xl" />
				</Link>
				<div className="w-full max-w-md bg-white p-10 shadow-xl">
					{children}
				</div>
			</main>

			<footer className="flex flex-col gap-2 px-6 py-5 text-xs text-navy/50 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex gap-6">
					<Link href="/conditions" className="hover:text-navy">
						Conditions d&apos;utilisation
					</Link>
					<Link href="/confidentialite" className="hover:text-navy">
						Politique de confidentialité
					</Link>
				</div>
				<p>© 2026 HomeCyclHome — Métropole de Lyon</p>
			</footer>
		</div>
	);
}
