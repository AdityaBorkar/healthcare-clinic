import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rpc } from "@/lib/rpc.client";

export const Route = createFileRoute("/(protected)/settings/org/branches/")({
  component: RouteComponent,
});

const BRANCH_TYPES = [
  "headquarters",
  "office",
  "warehouse",
  "store",
  "factory",
  "remote",
  "other",
] as const;

function RouteComponent() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: branches = [], isLoading } = useQuery(
    rpc.branches.list.queryOptions({ input: {} }),
  );

  const createMutation = useMutation(
    rpc.branches.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.branches.list.queryOptions({ input: {} }),
        );
        setCreateOpen(false);
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Branches</h1>
          <p className="text-muted-foreground">
            Manage your organization's branches and locations.
          </p>
        </div>
        <Dialog onOpenChange={setCreateOpen} open={createOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <BranchFormDialog
            isSaving={createMutation.isPending}
            onSubmit={(data) => createMutation.mutateAsync(data)}
          />
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(branches as Record<string, unknown>[]).length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center text-muted-foreground"
                    colSpan={5}
                  >
                    No branches yet. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                (branches as Record<string, unknown>[]).map(
                  (branch: Record<string, unknown>) => (
                    <TableRow key={branch.id as string}>
                      <TableCell>
                        <Link
                          className="font-medium text-primary hover:underline"
                          params={{
                            branchId: branch.id as string,
                          }}
                          to="/settings/branches/$branchId"
                        >
                          {branch.name as string}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{branch.code as string}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {(branch.type as string)?.replace("_", " ")}
                      </TableCell>
                      <TableCell>{(branch.city as string) || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            branch.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {branch.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ),
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function BranchFormDialog({
  onSubmit,
  isSaving,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: form data
  onSubmit: (data: any) => Promise<unknown>;
  isSaving: boolean;
}) {
  const id = useId();
  const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    code: "",
    country: "IN",
    email: "",
    name: "",
    phone: "",
    postalCode: "",
    state: "",
    type: "office",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add Branch</DialogTitle>
        <DialogDescription>
          Create a new branch location for your organization.
        </DialogDescription>
      </DialogHeader>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-branch-name`}>Branch Name</Label>
            <Input
              id={`${id}-branch-name`}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              value={form.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-branch-code`}>Branch Code</Label>
            <Input
              id={`${id}-branch-code`}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              placeholder="e.g. MUM-01"
              required
              value={form.code}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-branch-type`}>Type</Label>
            <Select
              onValueChange={(value: string | null) =>
                setForm({ ...form, type: value ?? "office" })
              }
              value={form.type}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRANCH_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-branch-country`}>Country Code</Label>
            <Input
              id={`${id}-branch-country`}
              maxLength={2}
              onChange={(e) =>
                setForm({ ...form, country: e.target.value.toUpperCase() })
              }
              placeholder="IN"
              required
              value={form.country}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-branch-addr1`}>Address Line 1</Label>
          <Input
            id={`${id}-branch-addr1`}
            onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
            required
            value={form.addressLine1}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-branch-addr2`}>Address Line 2</Label>
          <Input
            id={`${id}-branch-addr2`}
            onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
            value={form.addressLine2}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-branch-city`}>City</Label>
            <Input
              id={`${id}-branch-city`}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
              value={form.city}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-branch-state`}>State</Label>
            <Input
              id={`${id}-branch-state`}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              value={form.state}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-branch-pin`}>Postal Code</Label>
            <Input
              id={`${id}-branch-pin`}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              value={form.postalCode}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-branch-email`}>Email</Label>
            <Input
              id={`${id}-branch-email`}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              value={form.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-branch-phone`}>Phone</Label>
            <Input
              id={`${id}-branch-phone`}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              value={form.phone}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Creating..." : "Create Branch"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
