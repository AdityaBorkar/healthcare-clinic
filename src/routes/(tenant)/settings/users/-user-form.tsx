import { type ChangeEvent, type FormEvent, useCallback, useId, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type UserRole = "admin" | "member";

export type UserFormValues = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
};

type UserFormProps = {
  initialValues: UserFormValues;
  isOwner?: boolean;
  isEditing?: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => Promise<void>;
};

export function UserForm({
  initialValues,
  isOwner = false,
  isEditing = false,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const roleId = useId();

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, name: event.target.value }));
  }, []);
  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, email: event.target.value }));
  }, []);
  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, password: event.target.value }));
  }, []);
  const handleRoleChange = useCallback((role: UserRole | null) => {
    if (!role) {
      return;
    }
    setValues((current) => ({
      ...current,
      role,
    }));
  }, []);
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Unable to save user");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, values],
  );

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-1.5">
        <Label className="text-xs text-warm-gray" htmlFor={nameId}>
          Full name
        </Label>
        <Input
          autoComplete="name"
          id={nameId}
          onChange={handleNameChange}
          placeholder="Jane Doe"
          required
          value={values.name}
        />
      </div>

      <div className="grid gap-1.5">
        <Label className="text-xs text-warm-gray" htmlFor={emailId}>
          Email address
        </Label>
        <Input
          autoComplete="email"
          disabled={isEditing}
          id={emailId}
          onChange={handleEmailChange}
          placeholder="jane@acme.com"
          required
          type="email"
          value={values.email}
        />
        {isEditing ? (
          <p className="text-[11px] text-warm-gray">Email addresses cannot be changed here.</p>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="grid gap-1.5">
          <Label className="text-xs text-warm-gray" htmlFor={passwordId}>
            Temporary password
          </Label>
          <Input
            aria-describedby={`${passwordId}-hint`}
            autoComplete="new-password"
            id={passwordId}
            minLength={8}
            onChange={handlePasswordChange}
            placeholder="At least 8 characters"
            required
            type="password"
            value={values.password}
          />
          <p className="text-[11px] text-warm-gray" id={`${passwordId}-hint`}>
            Share this securely with the user so they can sign in.
          </p>
        </div>
      ) : null}

      <div className="grid gap-1.5">
        <Label className="text-xs text-warm-gray" htmlFor={roleId}>
          Workspace role
        </Label>
        {isOwner ? (
          <div
            className="flex h-9 items-center rounded-md border border-stone-muted bg-stone-muted/30 px-3 text-sm text-warm-gray"
            id={roleId}
          >
            Owner
          </div>
        ) : (
          <Select name="role" onValueChange={handleRoleChange} value={values.role}>
            <SelectTrigger className="h-9 w-full border-stone-muted bg-white text-sm" id={roleId}>
              <SelectValue>{values.role === "admin" ? "Administrator" : "Member"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        )}
        <p className="text-[11px] text-warm-gray">
          Administrators can manage workspace settings and users.
        </p>
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
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create user"}
        </Button>
      </div>
    </form>
  );
}
