import { Features } from "@/components/home/features";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";

export default function Home() {
	return (
		<>
			<Hero />
			<Features />
			<HowItWorks />
			<Testimonials />
			<FinalCta />
		</>
	);
}
