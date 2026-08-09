import { Zap, Wrench, Leaf } from "lucide-react";

const FEATURES = [
	{
		icon: Zap,
		title: "Rapidité",
		body: "Intervention garatie sous 24 à 48h partout dans la métropole lyonnaise. Ne perdez plus une minute",
		highlighted: false,
	},
	{
		icon: Wrench,
		title: "Expertise",
		body: "Nos techniciens sont certifiés et équipés des meilleurs outils pour tous types de vélos: électriques, route, VTT",
		highlighted: true,
	},
	{
		icon: Leaf,
		title: "Eco-responsable",
		body: "Nous nous déplaçons exclusivement en vélo-cargo et utilisons des lubrifiants biodégradables",
		highlighted: false,
	},
] as const;

export function Features() {
	return (
		<section aria-labelledby="features-title" className="bg-surface py-20">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<h2
					id="features-title"
					className="text-center font-heading text-3xl font-extrabold text-navy"
				>
					Pourquoi nous choisir ?
				</h2>
				<div
					aria-hidden="true"
					className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand"
				/>
				<ul className="mt-12 grid gap-6 md:grid-cols-3">
					{FEATURES.map(({ icon: Icon, title, body, highlighted }) => (
						<li
							key={title}
							className={`rounded-lg border bg-white p-6 ${highlighted ? "border-brand shadow-lg md:-mt-3 md:mb-3" : "border-zinc-200"}`}
						>
							<span
								className={`mb-5 inline-flex rounded-md p-2.5 ${highlighted ? "bg-brand text-white" : "bg-surface-alt text-brand"}`}
							>
								<Icon size={22} aria-hidden="true" />
							</span>
							<h3 className="font-heading text-xl font-bold text-navy">
								{title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-navy/70">
								{body}
							</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
