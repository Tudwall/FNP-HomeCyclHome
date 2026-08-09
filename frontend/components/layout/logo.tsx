export function Logo({
	tone = "brand",
	className = "text-lg",
}: {
	tone?: "brand" | "navy";
	className?: string;
}) {
	return (
		<span
			className={`font-heading font-extrabold tracking-tight text-navy ${className}`}
		>
			Home
			<span className={tone === "brand" ? "text-brand" : undefined}>Cycl</span>
			Home
		</span>
	);
}
