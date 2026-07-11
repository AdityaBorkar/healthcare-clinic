import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { rpc } from "@/lib/rpc.client";

export const Route = createFileRoute("/(protected)/settings/org/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: org, isLoading } = useQuery(
    rpc.organization.get.queryOptions(),
  );

  const updateMutation = useMutation(
    rpc.organization.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(rpc.organization.get.queryOptions());
      },
    }),
  );

  const brandingMutation = useMutation(
    rpc.organization.updateBranding.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(rpc.organization.get.queryOptions());
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl">Organization</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and branding.
        </p>
      </div>

      <GeneralSettingsCard
        isSaving={updateMutation.isPending}
        onSave={(data) => updateMutation.mutateAsync(data)}
        org={org}
      />

      <Separator />

      <BrandingCard
        isSaving={brandingMutation.isPending}
        onSave={(data) => brandingMutation.mutateAsync(data)}
        org={org}
      />
    </div>
  );
}

function GeneralSettingsCard({
  org,
  onSave,
  isSaving,
}: {
  org: Record<string, unknown> | null | undefined;
  onSave: (data: Record<string, unknown>) => Promise<unknown>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    address: (org?.address as string) ?? "",
    email: (org?.email as string) ?? "",
    industry: (org?.industry as string) ?? "",
    locale: (org?.locale as string) ?? "en-US",
    name: (org?.name as string) ?? "",
    phone: (org?.phone as string) ?? "",
    registrationNumber: (org?.registrationNumber as string) ?? "",
    taxId: (org?.taxId as string) ?? "",
    timezone: (org?.timezone as string) ?? "UTC",
    website: (org?.website as string) ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Basic information about your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                value={form.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                value={form.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                value={form.phone}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                value={form.website}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                value={form.timezone}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Input
                id="locale"
                onChange={(e) => setForm({ ...form, locale: e.target.value })}
                value={form.locale}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                value={form.industry}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regNo">Registration Number</Label>
              <Input
                id="regNo"
                onChange={(e) =>
                  setForm({ ...form, registrationNumber: e.target.value })
                }
                value={form.registrationNumber}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / PAN</Label>
              <Input
                id="taxId"
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                value={form.taxId}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              value={form.address}
            />
          </div>
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function BrandingCard({
  org,
  onSave,
  isSaving,
}: {
  org: Record<string, unknown> | null | undefined;
  onSave: (data: Record<string, unknown>) => Promise<unknown>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    accentColor: (org?.accentColor as string) ?? "#3B82F6",
    logo: (org?.logo as string) ?? "",
    name: (org?.name as string) ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
        <CardDescription>
          Customize the look and feel of your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Display Name</Label>
              <Input
                id="brandName"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                value={form.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center gap-2">
                <input
                  className="h-10 w-10 cursor-pointer rounded border"
                  id="accentColor"
                  onChange={(e) =>
                    setForm({ ...form, accentColor: e.target.value })
                  }
                  type="color"
                  value={form.accentColor}
                />
                <Input
                  onChange={(e) =>
                    setForm({ ...form, accentColor: e.target.value })
                  }
                  placeholder="#3B82F6"
                  value={form.accentColor}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              placeholder="https://..."
              value={form.logo}
            />
          </div>
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : "Save Branding"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
