type FormFeedbackProps = {
	error?: string;
	success?: string;
};

export function FormFeedback({ error, success }: FormFeedbackProps) {
	return (
		<>
			{error && (
				<p
					role="alert"
					className="rounded-sm bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
				>
					{error}
				</p>
			)}
			{success && (
				<p
					role="status"
					className="rounded-sm bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
				>
					{success}
				</p>
			)}
		</>
	);
}
