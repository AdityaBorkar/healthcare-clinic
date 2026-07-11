import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Archive, Pencil, Plus } from "lucide-react";
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

export const Route = createFileRoute("/(protected)/settings/org/connections")({
  component: RouteComponent,
});

const CONNECTION_TYPES = [
  "client",
  "vendor",
  "partner",
  "bank",
  "insurer",
  "regulator",
  "other",
] as const;

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  former: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-800",
  prospect: "bg-blue-100 text-blue-800",
};

function RouteComponent() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: connections = [], isLoading } = useQuery(
    rpc.connections.list.queryOptions({ input: {} }),
  );

  const createMutation = useMutation(
    rpc.connections.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.connections.list.queryOptions({ input: {} }),
        );
        setCreateOpen(false);
      },
    }),
  );

  const updateMutation = useMutation(
    rpc.connections.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.connections.list.queryOptions({ input: {} }),
        );
        setEditId(null);
      },
    }),
  );

  const archiveMutation = useMutation(
    rpc.connections.archive.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          rpc.connections.list.queryOptions({ input: {} }),
        );
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
          <h1 className="font-bold text-2xl">Connections</h1>
          <p className="text-muted-foreground">
            Manage your vendors, clients, and partners.
          </p>
        </div>
        <Dialog onOpenChange={setCreateOpen} open={createOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Connection
            </Button>
          </DialogTrigger>
          <ConnectionFormDialog
            description="Create a new connection."
            isSaving={createMutation.isPending}
            onSubmit={(data) => createMutation.mutateAsync(data)}
            title="Add Connection"
          />
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center text-muted-foreground"
                    colSpan={5}
                  >
                    No connections yet. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                connections.map((conn: Record<string, unknown>) => (
                  <TableRow key={conn.id as string}>
                    <TableCell className="font-medium">
                      {conn.name as string}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {(conn.type as string)?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(conn.contactPerson as string) || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          STATUS_COLORS[(conn.status as string) ?? "active"] ??
                          ""
                        }
                      >
                        {(conn.status as string) ?? "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => setEditId(conn.id as string)}
                          size="icon"
                          variant="ghost"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            archiveMutation.mutateAsync({
                              id: conn.id as string,
                            })
                          }
                          size="icon"
                          variant="ghost"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog onOpenChange={() => setEditId(null)} open={editId !== null}>
        {editId ? (
          <ConnectionFormDialog
            description="Update connection details."
            isSaving={updateMutation.isPending}
            onSubmit={(data) =>
              updateMutation.mutateAsync({ data, id: editId })
            }
            title="Edit Connection"
          />
        ) : null}
      </Dialog>
    </div>
  );
}

export function ConnectionFormDialog({
  title,
  description,
  onSubmit,
  isSaving,
}: {
  title: string;
  description: string;
  // biome-ignore lint/suspicious/noExplicitAny: form data varies
  onSubmit: (data: any) => Promise<unknown>;
  isSaving: boolean;
}) {
  const id = useId();
  const [form, setForm] = useState({
    contactEmail: "",
    contactPerson: "",
    contactPhone: "",
    industry: "",
    name: "",
    notes: "",
    type: "vendor",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      createdBy: "current-user",
    } as Record<string, unknown>);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor={`${id}-conn-name`}>Name</Label>
          <Input
            id={`${id}-conn-name`}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            value={form.name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-conn-type`}>Type</Label>
          <Select
            onValueChange={(value: string | null) =>
              setForm({ ...form, type: value ?? "vendor" })
            }
            value={form.type}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONNECTION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-conn-contact`}>Contact Person</Label>
            <Input
              id={`${id}-conn-contact`}
              onChange={(e) =>
                setForm({ ...form, contactPerson: e.target.value })
              }
              value={form.contactPerson}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-conn-email`}>Contact Email</Label>
            <Input
              id={`${id}-conn-email`}
              onChange={(e) =>
                setForm({ ...form, contactEmail: e.target.value })
              }
              type="email"
              value={form.contactEmail}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-conn-phone`}>Phone</Label>
            <Input
              id={`${id}-conn-phone`}
              onChange={(e) =>
                setForm({ ...form, contactPhone: e.target.value })
              }
              value={form.contactPhone}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-conn-website`}>Website</Label>
            <Input
              id={`${id}-conn-website`}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              value={form.website}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
