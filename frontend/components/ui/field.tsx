import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type FieldProps = Omit<ComponentProps<"input">, "id"> & {
	label: string;
	name: string;
	icon?: LucideIcon;
	action?: ReactNode;
	trailing?: ReactNode;
	errors?: string[];
};

export function Field({
	label,
	name,
	icon: Icon,
	action,
	trailing,
	errors,
	className,
	...props
}: FieldProps) {
	const errorId = `${name}-error`;
	const error = errors?.[0];

	return (
		<div className="space-y-2">
			<div className="flex items-baseline justify-between gap-3">
				<label
					htmlFor={name}
					className="text-xs font-bold uppercase tracking-wider text-navy"
				>
					{label}
				</label>
				{action}
			</div>

			<div className="relative">
				{Icon && (
					<Icon
						size={18}
						aria-hidden="true"
						className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40"
					/>
				)}
				<input
					id={name}
					name={name}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? errorId : undefined}
					className={`w-full rounded-sm bg-surface-alt py-3.5 text-sm text-navy outline-none transition-shadow placeholder:text-navy/40 focus:ring-2 focus:ring-brand/40 ${
						Icon ? "pl-12" : "pl-4"
					} ${trailing ? "pr-12" : "pr-4"} ${
						error ? "ring-2 ring-red-500" : ""
					} ${className ?? ""}`}
					{...props}
				/>
				{trailing && (
					<div className="absolute right-2 top-1/2 -translate-y-1/2">
						{trailing}
					</div>
				)}
			</div>

			{error && (
				<p id={errorId} className="text-xs font-medium text-red-600">
					{error}
				</p>
			)}
		</div>
	);
}
