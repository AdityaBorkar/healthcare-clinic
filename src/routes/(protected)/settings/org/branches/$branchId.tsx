import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rpc } from "@/lib/rpc.client";

export const Route = createFileRoute(
  "/(protected)/settings/org/branches/$branchId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { branchId } = Route.useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl">Branch Details</h1>
        <p className="text-muted-foreground">
          Manage branch information, address, bank account, and compliance.
        </p>
      </div>

      <Tabs className="space-y-6" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="bank">Bank Account</TabsTrigger>
          <TabsTrigger value="gstn">GSTN / Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab branchId={branchId} />
        </TabsContent>
        <TabsContent value="address">
          <AddressTab branchId={branchId} />
        </TabsContent>
        <TabsContent value="bank">
          <BankAccountTab branchId={branchId} />
        </TabsContent>
        <TabsContent value="gstn">
          <GSTNTab branchId={branchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab({ branchId }: { branchId: string }) {
  const queryClient = useQueryClient();
  const { data: branch, isLoading } = useQuery(
    rpc.branches.getById.queryOptions({ input: { id: branchId } }),
  );

  const updateMutation = useMutation(
    rpc.branches.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.branches.getById.queryOptions({ input: { id: branchId } }),
        );
      },
    }),
  );

  const activateMutation = useMutation(
    rpc.branches.activate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.branches.getById.queryOptions({ input: { id: branchId } }),
        );
      },
    }),
  );

  const deactivateMutation = useMutation(
    rpc.branches.deactivate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.branches.getById.queryOptions({ input: { id: branchId } }),
        );
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    );
  }

  const b = branch as Record<string, unknown>;
  if (!b) return <div>Branch not found.</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{b.name as string}</CardTitle>
            <CardDescription>
              Code: {b.code as string} &middot; Type:{" "}
              {(b.type as string)?.replace("_", " ")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={
                b.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {b.isActive ? "Active" : "Inactive"}
            </Badge>
            <Switch
              checked={b.isActive as boolean}
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  activateMutation.mutate({ id: branchId });
                } else {
                  deactivateMutation.mutate({ id: branchId });
                }
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <BranchEditForm
          branch={b}
          isSaving={updateMutation.isPending}
          onSave={(data) => updateMutation.mutateAsync({ data, id: branchId })}
        />
      </CardContent>
    </Card>
  );
}

function BranchEditForm({
  branch,
  onSave,
  isSaving,
}: {
  branch: Record<string, unknown>;
  // biome-ignore lint/suspicious/noExplicitAny: form data
  onSave: (data: any) => Promise<unknown>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    code: (branch.code as string) ?? "",
    email: (branch.email as string) ?? "",
    name: (branch.name as string) ?? "",
    phone: (branch.phone as string) ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Branch Name</Label>
          <Input
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            value={form.name}
          />
        </div>
        <div className="space-y-2">
          <Label>Branch Code</Label>
          <Input
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
            value={form.code}
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            value={form.email}
          />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            value={form.phone}
          />
        </div>
      </div>
      <Button disabled={isSaving} type="submit">
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

function AddressTab({ branchId }: { branchId: string }) {
  const queryClient = useQueryClient();
  const { data: branch, isLoading } = useQuery(
    rpc.branches.getById.queryOptions({ input: { id: branchId } }),
  );

  const updateMutation = useMutation(
    rpc.branches.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.branches.getById.queryOptions({ input: { id: branchId } }),
        );
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    );
  }

  const b = branch as Record<string, unknown>;
  if (!b) return <div>Branch not found.</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Address</CardTitle>
        <CardDescription>
          Address information for this branch location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AddressEditForm
          branch={b}
          isSaving={updateMutation.isPending}
          onSave={(data) => updateMutation.mutateAsync({ data, id: branchId })}
        />
      </CardContent>
    </Card>
  );
}

function AddressEditForm({
  branch,
  onSave,
  isSaving,
}: {
  branch: Record<string, unknown>;
  // biome-ignore lint/suspicious/noExplicitAny: form data
  onSave: (data: any) => Promise<unknown>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    addressLine1: (branch.addressLine1 as string) ?? "",
    addressLine2: (branch.addressLine2 as string) ?? "",
    city: (branch.city as string) ?? "",
    country: (branch.country as string) ?? "IN",
    postalCode: (branch.postalCode as string) ?? "",
    state: (branch.state as string) ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label>Address Line 1</Label>
        <Input
          onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
          required
          value={form.addressLine1}
        />
      </div>
      <div className="space-y-2">
        <Label>Address Line 2</Label>
        <Input
          onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
          value={form.addressLine2}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
            value={form.city}
          />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            value={form.state}
          />
        </div>
        <div className="space-y-2">
          <Label>Postal Code</Label>
          <Input
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            value={form.postalCode}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Country Code</Label>
        <Input
          maxLength={2}
          onChange={(e) =>
            setForm({ ...form, country: e.target.value.toUpperCase() })
          }
          placeholder="IN"
          value={form.country}
        />
      </div>
      <Button disabled={isSaving} type="submit">
        {isSaving ? "Saving..." : "Save Address"}
      </Button>
    </form>
  );
}

function BankAccountTab({ branchId: _branchId }: { branchId: string }) {
  const queryClient = useQueryClient();
  const { data: accounts = [], isLoading } = useQuery(
    rpc.bankAccounts.list.queryOptions(),
  );

  const createMutation = useMutation(
    rpc.bankAccounts.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(rpc.bankAccounts.list.queryOptions());
      },
    }),
  );

  const updateMutation = useMutation(
    rpc.bankAccounts.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(rpc.bankAccounts.list.queryOptions());
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    );
  }

  const account = (accounts as Record<string, unknown>[])[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Account</CardTitle>
        <CardDescription>
          Billing bank account details for this branch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BankAccountForm
          account={account}
          isSaving={createMutation.isPending || updateMutation.isPending}
          onSave={(data) => {
            if (account) {
              return updateMutation.mutateAsync({
                data,
                id: account.id as string,
              });
            }
            return createMutation.mutateAsync(data);
          }}
        />
      </CardContent>
    </Card>
  );
}

function BankAccountForm({
  account,
  onSave,
  isSaving,
}: {
  account?: Record<string, unknown>;
  // biome-ignore lint/suspicious/noExplicitAny: form data
  onSave: (data: any) => Promise<unknown>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    accountHolderName: (account?.accountHolderName as string) ?? "",
    accountNumber: (account?.accountNumber as string) ?? "",
    accountType: (account?.accountType as string) ?? "savings",
    bankName: (account?.bankName as string) ?? "",
    branchName: (account?.branchName as string) ?? "",
    ifscCode: (account?.routingNumber as string) ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      accountHolderName: form.accountHolderName,
      accountNumber: form.accountNumber,
      accountType: form.accountType,
      bankName: form.bankName,
      branchName: form.branchName,
      currency: "INR",
      routingNumber: form.ifscCode,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Account Holder Name</Label>
          <Input
            onChange={(e) =>
              setForm({ ...form, accountHolderName: e.target.value })
            }
            required
            value={form.accountHolderName}
          />
        </div>
        <div className="space-y-2">
          <Label>Account Number</Label>
          <Input
            onChange={(e) =>
              setForm({ ...form, accountNumber: e.target.value })
            }
            required
            value={form.accountNumber}
          />
        </div>
        <div className="space-y-2">
          <Label>Bank Name</Label>
          <Input
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
            required
            value={form.bankName}
          />
        </div>
        <div className="space-y-2">
          <Label>Branch Name</Label>
          <Input
            onChange={(e) => setForm({ ...form, branchName: e.target.value })}
            value={form.branchName}
          />
        </div>
        <div className="space-y-2">
          <Label>IFSC / Routing Number</Label>
          <Input
            onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
            value={form.ifscCode}
          />
        </div>
        <div className="space-y-2">
          <Label>Account Type</Label>
          <Input
            onChange={(e) => setForm({ ...form, accountType: e.target.value })}
            placeholder="savings / current"
            value={form.accountType}
          />
        </div>
      </div>
      <Button disabled={isSaving} type="submit">
        {isSaving ? "Saving..." : account ? "Update Account" : "Add Account"}
      </Button>
    </form>
  );
}

function GSTNTab({ branchId }: { branchId: string }) {
  const queryClient = useQueryClient();
  const { data: compliance = [], isLoading } = useQuery(
    rpc.compliance.list.queryOptions({
      input: { branch: branchId, category: "tax" },
    }),
  );

  const createMutation = useMutation(
    rpc.compliance.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.compliance.list.queryOptions({
            input: { branch: branchId, category: "tax" },
          }),
        );
      },
    }),
  );

  const updateMutation = useMutation(
    rpc.compliance.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.compliance.list.queryOptions({
            input: { branch: branchId, category: "tax" },
          }),
        );
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    );
  }

  const gstnDoc = (compliance as Record<string, unknown>[]).find(
    (c: Record<string, unknown>) =>
      (c.name as string)?.toLowerCase().includes("gstn") ||
      (c.name as string)?.toLowerCase().includes("gst"),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>GSTN Compliance</CardTitle>
        <CardDescription>
          Goods and Services Tax registration details for this branch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GSTNForm
          branchId={branchId}
          document={gstnDoc}
          isSaving={createMutation.isPending || updateMutation.isPending}
          onSave={(data) => {
            if (gstnDoc) {
              return updateMutation.mutateAsync({
                data,
                id: gstnDoc.id as string,
              });
            }
            return createMutation.mutateAsync(data);
          }}
        />
      </CardContent>
    </Card>
  );
}

function GSTNForm({
  document,
  branchId,
  onSave,
  isSaving,
}: {
  document?: Record<string, unknown>;
  branchId: string;
  // biome-ignore lint/suspicious/noExplicitAny: form data
  onSave: (data: any) => Promise<unknown>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    gstin: (document?.documentNumber as string) ?? "",
    issuingAuthority: (document?.issuingAuthority as string) ?? "",
    legalName: (document?.name as string) ?? "",
    notes: (document?.notes as string) ?? "",
    registrationDate: (document?.issueDate as string) ?? "",
    stateCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      branch: branchId,
      category: "tax",
      createdBy: "system",
      documentNumber: form.gstin,
      issueDate: form.registrationDate || undefined,
      issuingAuthority: form.issuingAuthority || undefined,
      name: form.legalName || "GSTN Registration",
      notes: form.notes || undefined,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>GSTIN Number</Label>
          <Input
            maxLength={15}
            onChange={(e) => setForm({ ...form, gstin: e.target.value })}
            placeholder="22AAAAA0000A1Z5"
            value={form.gstin}
          />
        </div>
        <div className="space-y-2">
          <Label>Legal Name</Label>
          <Input
            onChange={(e) => setForm({ ...form, legalName: e.target.value })}
            value={form.legalName}
          />
        </div>
        <div className="space-y-2">
          <Label>Registration Date</Label>
          <Input
            onChange={(e) =>
              setForm({ ...form, registrationDate: e.target.value })
            }
            type="date"
            value={form.registrationDate}
          />
        </div>
        <div className="space-y-2">
          <Label>State Code</Label>
          <Input
            maxLength={2}
            onChange={(e) => setForm({ ...form, stateCode: e.target.value })}
            placeholder="27"
            value={form.stateCode}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Issuing Authority</Label>
        <Input
          onChange={(e) =>
            setForm({ ...form, issuingAuthority: e.target.value })
          }
          value={form.issuingAuthority}
        />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Input
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          value={form.notes}
        />
      </div>
      <Button disabled={isSaving} type="submit">
        {isSaving
          ? "Saving..."
          : document
            ? "Update GSTN"
            : "Add GSTN Registration"}
      </Button>
    </form>
  );
}
