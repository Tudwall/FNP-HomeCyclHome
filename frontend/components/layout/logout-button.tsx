import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export function LogoutButton({ className }: { className?: string }) {
	return (
		<form action={logoutAction}>
			<button
				type="submit"
				className={`flex items-center gap-2 text-sm font-medium text-navy transition-colors hover:text-brand ${
					className ?? ""
				}`}
			>
				<LogOut size={16} aria-hidden="true" />
				Déconnexion
			</button>
		</form>
	);
}
