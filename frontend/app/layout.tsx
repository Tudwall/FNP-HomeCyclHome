import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
	title: {
		default: "HomeCyclHome - Réparation de vélos à domicile à Lyon",
		template: "%s | HomeCyclHome",
	},
	description:
		"Nos mécaniciens experts se déplacent chez vous ou à votre bureau pour une intervention rapide et précise, partout dans la métropole Lyonnaise",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="fr"
			className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col font-sans">{children}</body>
		</html>
	);
}
