"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Field } from "./field";

type PasswordFieldProps = Omit<
	ComponentProps<typeof Field>,
	"icon" | "trailing" | "type"
>;

export function PasswordField(props: PasswordFieldProps) {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<Field
			{...props}
			type={isVisible ? "text" : "password"}
			icon={Lock}
			trailing={
				<button
					type="button"
					onClick={() => setIsVisible((visible) => !visible)}
					aria-label={
						isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"
					}
					aria-pressed={isVisible}
					className="rounded-sm p-2 text-navy/40 transition-colors hover:text-navy/70"
				>
					{isVisible ? (
						<EyeOff size={18} aria-hidden="true" />
					) : (
						<Eye size={18} aria-hidden="true" />
					)}
				</button>
			}
		/>
	);
}
