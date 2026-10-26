import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";

type SelectFieldProps = Omit<ComponentProps<"select">, "children"> & {
	id: string;
	label: string;
	placeholder: string;
	options: { value: number; label: string }[];
	errors?: string[];
};

export function SelectField({
	id,
	label,
	placeholder,
	options,
	errors,
	className,
	...props
}: SelectFieldProps) {
	const errorId = `${id}-error`;
	const error = errors?.[0];

	return (
		<div className="space-y-2">
			<label
				htmlFor={id}
				className="text-xs font-bold uppercase tracking-wider text-navy"
			>
				{label}
			</label>

			<div className="relative">
				<select
					id={id}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? errorId : undefined}
					className={`w-full appearance-none rounded-sm bg-surface-alt py-3.5 pl-4 pr-10 text-sm text-navy outline-none transition-shadow focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60 ${
						error ? "ring-2 ring-red-500" : ""
					} ${className ?? ""}`}
					{...props}
				>
					<option value="" disabled>
						{placeholder}
					</option>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<ChevronDown
					size={18}
					aria-hidden="true"
					className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy/40"
				/>
			</div>

			{error && (
				<p id={errorId} className="text-xs font-medium text-red-600">
					{error}
				</p>
			)}
		</div>
	);
}
