import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero.jpg";

export function Hero() {
	return (
		<section className="relative isolate flex min-h-[560px] items-center overflow-hidden lg:min-h-[640px]">
			<Image
				src={heroImage}
				alt=""
				fill
				priority
				sizes="100vw"
				placeholder="blur"
				className="-z-10 object-cover object-center"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/90 via-navy/60 to-navy/10"
			/>
			<div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
				<p className="inline-flex rounded-sm bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
					Service à domicile
				</p>
				<h1 className="mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
					HomeCyclHome: Réparation de vélos à domicile à Lyon
				</h1>
				<p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">
					Nos mécaniciens experts se déplacent chez vous ou à votre bureau pour
					une intervention rapide et précise.
				</p>
				<div className="mt-9 flex flex-col gap-4 sm:flex-row">
					<Link
						href="/reserver"
						className="group inline-flex items-center justify-center gap-2 rounded-md bg-brand px-7 py-3.5 font-semibold text-white transition-colors hover:bg-brand-hover"
					>
						Réserver une intervention
						<ArrowRight
							size={18}
							aria-hidden="true"
							className="transition-transform group-hover:translate-x-1"
						/>
					</Link>
					<Link
						href="/tarifs"
						className="inline-flex items-center justify-center rounded-md border-2 border-white px-7 py-3.5 font-semibold text-white transition-colors hover:text-navy hover:bg-white"
					>
						Nos tarifs
					</Link>
				</div>
			</div>
		</section>
	);
}
