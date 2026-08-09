"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";

export function SubmitButton({ children }: { children: ReactNode }) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="flex w-full items-center justify-center gap-3 rounded-sm bg-brand px-5 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
		>
			{pending ? (
				"Un instant…"
			) : (
				<>
					{children}
					<ArrowRight size={18} aria-hidden="true" />
				</>
			)}
		</button>
	);
}
