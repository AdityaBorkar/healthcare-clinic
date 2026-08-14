import { type ChangeEvent, type FormEvent, useCallback, useId, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type OrganizationFormValues = {
  accentColor: string;
  address: string;
  email: string;
  foundedDate: string;
  industry: string;
  locale: string;
  name: string;
  phone: string;
  registrationNumber: string;
  slug: string;
  taxId: string;
  timezone: string;
  website: string;
};

type OrganizationFormProps = {
  initialValues: OrganizationFormValues;
  onCancel: () => void;
  onSubmit: (values: OrganizationFormValues) => Promise<void>;
};

export function OrganizationForm({ initialValues, onCancel, onSubmit }: OrganizationFormProps) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameId = useId();
  const slugId = useId();
  const foundedDateId = useId();
  const accentColorId = useId();

  const handleChange = useCallback(
    (key: keyof OrganizationFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
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
          submitError instanceof Error ? submitError.message : "Unable to save organization",
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
          <Label className="text-xs text-warm-gray" htmlFor={nameId}>
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
          <Label className="text-xs text-warm-gray" htmlFor={slugId}>
            Slug
          </Label>
          <Input
            id={slugId}
            onChange={handleChange("slug")}
            placeholder="acme-corp"
            required
            value={values.slug}
          />
          <p className="text-[11px] text-warm-gray">
            Used for this workspace's subdomain. Changing it changes your URL.
          </p>
        </div>

        <TextField
          label="Email"
          onChange={handleChange("email")}
          placeholder="legal@acme.com"
          type="email"
          value={values.email}
        />
        <TextField
          label="Phone"
          onChange={handleChange("phone")}
          placeholder="+1 555 000 0000"
          type="tel"
          value={values.phone}
        />
        <TextField
          label="Website"
          onChange={handleChange("website")}
          placeholder="https://acme.com"
          type="url"
          value={values.website}
        />
        <TextField
          label="Address"
          onChange={handleChange("address")}
          placeholder="123 Main Street, Springfield"
          value={values.address}
        />
        <TextField
          label="Industry"
          onChange={handleChange("industry")}
          placeholder="Manufacturing"
          value={values.industry}
        />
        <TextField
          label="Registration number"
          onChange={handleChange("registrationNumber")}
          placeholder="Optional"
          value={values.registrationNumber}
        />
        <TextField
          label="Tax ID"
          onChange={handleChange("taxId")}
          placeholder="Optional"
          value={values.taxId}
        />
        <div className="grid gap-1.5">
          <Label className="text-xs text-warm-gray" htmlFor={foundedDateId}>
            Founded date
          </Label>
          <Input
            id={foundedDateId}
            onChange={handleChange("foundedDate")}
            type="date"
            value={values.foundedDate}
          />
        </div>
        <TextField
          label="Locale"
          onChange={handleChange("locale")}
          placeholder="en-US"
          value={values.locale}
        />
        <TextField
          label="Timezone"
          onChange={handleChange("timezone")}
          placeholder="UTC"
          value={values.timezone}
        />

        <div className="grid gap-1.5">
          <Label className="text-xs text-warm-gray" htmlFor={accentColorId}>
            Accent color
          </Label>
          <Input
            id={accentColorId}
            onChange={handleChange("accentColor")}
            type="color"
            value={values.accentColor}
          />
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="text-destructive">{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col-reverse justify-end gap-2 border-t border-stone-border pt-4 sm:flex-row">
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

function TextField({
  label,
  type,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-warm-gray" htmlFor={id}>
        {label}
      </Label>
      <Input id={id} onChange={onChange} placeholder={placeholder} type={type} value={value} />
    </div>
  );
}
