import {
	type ChangeEvent,
	type FormEvent,
	useCallback,
	useId,
	useState,
} from "react";

import { Alert, AlertDescription } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

export type OrganizationFormValues = {
	logo: string;
	name: string;
	slug: string;
};

type OrganizationFormProps = {
	initialValues: OrganizationFormValues;
	onCancel: () => void;
	onSubmit: (values: OrganizationFormValues) => Promise<void>;
};

export function OrganizationForm({
	initialValues,
	onCancel,
	onSubmit,
}: OrganizationFormProps) {
	const [values, setValues] = useState(initialValues);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const nameId = useId();
	const slugId = useId();
	const logoId = useId();

	const handleChange = useCallback(
		(key: keyof OrganizationFormValues) =>
			(event: ChangeEvent<HTMLInputElement>) => {
				setValues((current) => ({ ...current, [key]: event.target.value }));
			},
		[],
	);

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setError(null);
			setIsSubmitting(true);

			try {
				await onSubmit(values);
			} catch (submitError) {
				setError(
					submitError instanceof Error
						? submitError.message
						: "Unable to save organization",
				);
			} finally {
				setIsSubmitting(false);
			}
		},
		[onSubmit, values],
	);

	return (
		<form className="grid gap-4" onSubmit={handleSubmit}>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-1.5">
					<Label className="text-xs text-muted-foreground" htmlFor={nameId}>
						Organization name
					</Label>
					<Input
						id={nameId}
						onChange={handleChange("name")}
						placeholder="Acme Corp"
						required
						value={values.name}
					/>
				</div>

				<div className="grid gap-1.5">
					<Label className="text-xs text-muted-foreground" htmlFor={slugId}>
						Slug
					</Label>
					<Input
						id={slugId}
						onChange={handleChange("slug")}
						placeholder="acme-corp"
						required
						value={values.slug}
					/>
					<p className="text-[11px] text-muted-foreground">
						Used for this workspace's subdomain. Changing it changes your URL.
					</p>
				</div>

				<div className="grid gap-1.5 sm:col-span-2">
					<Label className="text-xs text-muted-foreground" htmlFor={logoId}>
						Logo URL
					</Label>
					<Input
						id={logoId}
						onChange={handleChange("logo")}
						placeholder="https://example.com/logo.png"
						type="url"
						value={values.logo}
					/>
				</div>
			</div>

			{error ? (
				<Alert variant="destructive">
					<AlertDescription className="text-destructive">
						{error}
					</AlertDescription>
				</Alert>
			) : null}

			<div className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-4 sm:flex-row">
				<Button onClick={onCancel} type="button" variant="outline">
					Cancel
				</Button>
				<Button disabled={isSubmitting} type="submit">
					{isSubmitting ? "Saving..." : "Save changes"}
				</Button>
			</div>
		</form>
	);
}
