import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<SiteHeader />
			<main className="flex-1 bg-surface">
				<div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[200px_1fr]">
					<aside>
						<AccountNav />
					</aside>
					<div>{children}</div>
				</div>
			</main>
			<SiteFooter />
		</>
	);
}
