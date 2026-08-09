const STEPS = [
	{
		number: "01",
		title: "Choisissez",
		body: "Sélectionnez le type de vélo et la nature du problème via notre catalogue de services techniques.",
	},
	{
		number: "02",
		title: "Réservez",
		body: "Réservez le créneau qui vous convient, à domicile ou sur votre lieu de travail, en quelques clics.",
	},
	{
		number: "03",
		title: "On arrive",
		body: "Le mécanicien arrive à l'heure convenue avec otut le matériel nécessaire pour réparer votre vélo sur place.",
	},
] as const;

export function HowItWorks() {
	return (
		<section
			id="comment-ca-marche"
			aria-labelledby="how-it-works-title"
			className="bg-navy py-20 text-white"
		>
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<h2
					id="how-it-works-title"
					className="font-heading text-3xl font-extrabold"
				>
					Comment ça marche
				</h2>
				<p className="mt-2 text-white/70">
					Une réparation simplifiée en 3 étapes
				</p>
				<ol className="mt-14 grid gap-10 md:grid-cols-3">
					{STEPS.map((step) => (
						<li key={step.number}>
							<p
								aria-hidden="true"
								className="font-heading text-5xl font-extrabold text-white/20"
							>
								{step.number}
							</p>
							<h3 className="mt-3 font-heading text-xl font-bold">
								{step.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-white/70">
								{step.body}
							</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
