import Image from "next/image";
import claire from "@/assets/testimonials/claire.jpg";
import julien from "@/assets/testimonials/julien.jpg";
import pierreYves from "@/assets/testimonials/pierre-yves.jpg";

const TESTIMONIALS = [
	{
		avatar: claire,
		name: "Claire D.",
		area: "Lyon 6ème",
		quote:
			"Un service impeccable ! Le mécanicien est venu à mon bureau à la Part-Dieu et à réparé mes freins pendant ma réunion. Quel gain de temps.",
	},
	{
		avatar: julien,
		name: "Julien M.",
		area: "Croix-Rousse",
		quote:
			"Enfin des vrais experts qui connaissent les vélos électriques. Rapide, propre et très sympathique. Je recommande sans hésiter !",
	},
	{
		avatar: pierreYves,
		name: "Pierre-Yves L.",
		area: "Vieux Lyon",
		quote:
			"Plus besoin de porter mon vélo jusqu'à la boutique. Ils sont venus directement dans ma cour. Travail soigné et prix très honnêtes.",
	},
] as const;

export function Testimonials() {
	return (
		<section
			aria-labelledby="testimonials-title"
			className="bg-surface-alt py-20"
		>
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<h2
					id="testimonials-title"
					className="text-center font-heading text-3xl font-extrabold text-navy"
				>
					Témoignages
				</h2>
				<ul className="mt-12 grid gap-6 md:grid-cols-3">
					{TESTIMONIALS.map((testimonial) => (
						<li key={testimonial.name}>
							<figure className="relative h-full rounded-lg border border-zinc-200 bg-white p-6">
								<span
									aria-hidden="true"
									className="absolute right-5 top-4 font-heading text-2xl font-bold text-brand/40"
								>
									99
								</span>
								<figcaption className="flex items-center gap-3">
									<Image
										src={testimonial.avatar}
										alt=""
										className="size-10 rounded-full object-cover"
									/>
									<span>
										<span className="block text-sm font-bold text-navy">
											{testimonial.name}
										</span>
										<span className="block text-xs text-navy/60">
											{testimonial.area}
										</span>
									</span>
								</figcaption>
								<blockquote className="mt-4 text-sm italic leading-relaxed text-navy/80">
									<p>« {testimonial.quote} »</p>
								</blockquote>
							</figure>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
