import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, UserPlus, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)/settings/users/")({
  component: UsersPage,
  loader: async () => {
    try {
      return await orpc.users.list();
    } catch (error) {
      console.error("Failed to load users", error);
      return null;
    }
  },
});

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  member: "Member",
  owner: "Owner",
};

function UsersPage() {
  const users = Route.useLoaderData();
  const count = users?.length ?? 0;

  return (
    <main className="bg-stone-canvas p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          actions={
            <div className="flex items-center gap-2">
              <Badge
                className="hidden items-center gap-2 rounded-full border-stone-border bg-white px-3 py-1.5 text-xs text-warm-gray sm:inline-flex"
                variant="outline"
              >
                <UsersRound className="size-4" />
                {count} {count === 1 ? "user" : "users"}
              </Badge>
              <Button nativeButton={false} render={<Link to="/settings/users/new" />}>
                <Plus />
                Add user
              </Button>
            </div>
          }
          description="Manage the people who can access this workspace."
          title="Users"
        />

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Workspace users</CardTitle>
                <p className="mt-1 text-xs text-warm-gray">
                  Roles and access are provisioned through Aspen.
                </p>
              </div>
              <UserPlus className="size-5 text-warm-gray" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {users === null ? (
              <EmptyState
                description="We could not load users from Aspen. Try refreshing the page."
                title="Users are unavailable"
              />
            ) : users.length === 0 ? (
              <EmptyState
                description="Users will appear here when they are provisioned for this workspace."
                title="No users yet"
              />
            ) : (
              <Table className="min-w-[680px]">
                <TableHeader className="bg-stone-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-5 text-xs text-warm-gray">User</TableHead>
                    <TableHead className="px-5 text-xs text-warm-gray">Role</TableHead>
                    <TableHead className="px-5 text-xs text-warm-gray">Added</TableHead>
                    <TableHead className="px-5 text-right text-xs text-warm-gray" />
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-stone-border">
                  {users.map((user) => (
                    <TableRow className="hover:bg-stone-muted/20" key={user.id}>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name ?? user.email ?? "?"} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink-black">
                              {user.name ?? "Unnamed user"}
                            </p>
                            <p className="truncate text-xs text-warm-gray">
                              {user.email ?? "No email"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Badge className="bg-sky-wash/40 text-cyan-edge">
                          {roleLabels[user.role ?? ""] ?? user.role ?? "Unassigned"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-xs text-warm-gray">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        <Link
                          className="text-xs font-medium text-cyan-edge hover:underline"
                          params={{ id: user.id }}
                          to="/settings/users/$id"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// Biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function EmptyState({ description, title }: { description: string; title: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-sm font-medium text-ink-black">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-xs text-warm-gray">{description}</p>
    </div>
  );
}

// Biome-ignore lint/style/useComponentExportOnlyModules: route modules export a Route config alongside render helpers
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Avatar className="size-9 bg-stone-muted/40">
      <AvatarFallback className="bg-stone-muted/40 text-xs font-medium text-warm-gray">
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "—";
  }
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
