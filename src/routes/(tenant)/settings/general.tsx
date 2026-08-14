import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Building2, Pencil } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";

import { OrganizationForm, type OrganizationFormValues } from "./-organization-form";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)/settings/general")({
  component: GeneralPage,
  loader: async () => {
    try {
      return await orpc.organizations.current();
    } catch (error) {
      console.error("Failed to load organization", error);
      return null;
    }
  },
});

function GeneralPage() {
  const organization = Route.useLoaderData();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = useCallback(() => setIsEditing(true), []);
  const handleCancelEdit = useCallback(() => setIsEditing(false), []);

  const handleSubmit = useCallback(
    async (values: OrganizationFormValues) => {
      await orpc.organizations.update({
        accentColor: values.accentColor,
        address: values.address || null,
        email: values.email || null,
        foundedDate: values.foundedDate || undefined,
        industry: values.industry || null,
        locale: values.locale,
        name: values.name,
        phone: values.phone || null,
        registrationNumber: values.registrationNumber || null,
        slug: values.slug,
        taxId: values.taxId || null,
        timezone: values.timezone,
        website: values.website || null,
      });
      await router.invalidate();
      setIsEditing(false);
    },
    [router],
  );

  if (organization === null) {
    return (
      <main className="bg-stone-canvas p-4 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <PageHeader description="Organization profile and workspace details." title="General" />
          <Card>
            <CardContent className="py-16 text-center">
              <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-stone-muted/40">
                <Building2 className="size-6 text-warm-gray" />
              </span>
              <p className="text-sm font-medium text-ink-black">
                Organization information is unavailable
              </p>
              <p className="mx-auto mt-2 max-w-sm text-xs text-warm-gray">
                We could not load your organization's profile. Try refreshing the page.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (isEditing) {
    return (
      <main className="bg-stone-canvas p-4 sm:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <PageHeader
            description="Update your organization's information."
            title="Edit organization"
          />
          <Card>
            <CardContent className="p-6">
              <OrganizationForm
                initialValues={toFormValues(organization)}
                onCancel={handleCancelEdit}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-stone-canvas p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          actions={
            <Button onClick={handleEdit} variant="outline">
              <Pencil />
              Edit organization
            </Button>
          }
          description="Organization profile and workspace details."
          title="General"
        />

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Organization profile</CardTitle>
            <CardDescription>Public information about this organization.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Detail label="Name" value={organization.name} />
              <Detail label="Slug" value={organization.slug} />
              <Detail label="Email" value={organization.email} />
              <Detail label="Phone" value={organization.phone} />
              <Detail label="Website" value={organization.website} />
              <Detail label="Address" value={organization.address} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Company details</CardTitle>
            <CardDescription>Additional profile fields for this organization.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Detail label="Industry" value={organization.industry} />
              <Detail label="Registration number" value={organization.registrationNumber} />
              <Detail label="Tax ID" value={organization.taxId} />
              <Detail label="Founded date" value={formatDate(organization.foundedDate)} />
              <Detail label="Locale" value={organization.locale} />
              <Detail label="Timezone" value={organization.timezone} />
              <div>
                <dt className="text-xs font-medium text-warm-gray">Accent color</dt>
                <dd className="mt-1.5 flex items-center gap-2 text-sm text-ink-black">
                  <span
                    className="size-4 rounded-full ring-1 ring-foreground/15 ring-inset"
                    style={{ backgroundColor: organization.accentColor }}
                  />
                  {organization.accentColor}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Workspace</CardTitle>
            <CardDescription>System information about this workspace.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-warm-gray">Status</dt>
                <dd className="mt-1.5">
                  <StatusBadge status={organization.status} />
                </dd>
              </div>
              <Detail label="Created" value={formatDateTime(organization.createdAt)} />
              <Detail label="Last updated" value={formatDateTime(organization.updatedAt)} />
              <Detail
                label="Organization ID"
                value={<code className="font-mono text-xs break-all">{organization.id}</code>}
              />
            </dl>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function toFormValues(
  organization: NonNullable<ReturnType<typeof Route.useLoaderData>>,
): OrganizationFormValues {
  return {
    accentColor: organization.accentColor,
    address: organization.address ?? "",
    email: organization.email ?? "",
    foundedDate: organization.foundedDate ?? "",
    industry: organization.industry ?? "",
    locale: organization.locale,
    name: organization.name,
    phone: organization.phone ?? "",
    registrationNumber: organization.registrationNumber ?? "",
    slug: organization.slug,
    taxId: organization.taxId ?? "",
    timezone: organization.timezone,
    website: organization.website ?? "",
  };
}

// Biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-warm-gray">{label}</dt>
      <dd className="mt-1 text-sm break-words text-ink-black">{value ?? "—"}</dd>
    </div>
  );
}

// Biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "active" ? "outline" : status === "suspended" ? "destructive" : "secondary";

  return (
    <Badge className="gap-1.5 px-2 py-0.5 text-[11px]" variant={variant}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </Badge>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
