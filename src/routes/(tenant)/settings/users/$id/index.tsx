import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Mail, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)/settings/users/$id/")({
  component: UserDetailsPage,
  loader: async ({ params }) => {
    try {
      return await orpc.users.get({ id: params.id });
    } catch (error) {
      console.error("Failed to load user", error);
      return null;
    }
  },
});

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  member: "Member",
  owner: "Owner",
};

function UserDetailsPage() {
  const user = Route.useLoaderData();
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const handleRemove = useCallback(async () => {
    if (!user) {
      return;
    }

    setRemoveError(null);
    setIsRemoving(true);
    try {
      await orpc.users.remove({ id: user.id });
      await navigate({ to: "/settings/users" });
    } catch (error) {
      setRemoveError(error instanceof Error ? error.message : "Unable to remove user");
      setIsRemoving(false);
      setIsRemoveDialogOpen(false);
    }
  }, [navigate, user]);

  if (!user) {
    return (
      <main className="bg-stone-canvas p-4 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <PageHeader
            actions={
              <Button nativeButton={false} render={<Link to="/settings/users" />} variant="outline">
                <ArrowLeft />
                Back to users
              </Button>
            }
            description="The user may have been removed or you may not have access to this workspace."
            title="User unavailable"
          />
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-sm font-medium text-ink-black">We could not find this user</p>
              <p className="mt-2 text-xs text-warm-gray">
                Return to the users list to see the current workspace members.
              </p>
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
            <div className="flex items-center gap-2">
              <Button
                nativeButton={false}
                render={<Link params={{ id: user.id }} to="/settings/users/$id/edit" />}
                variant="outline"
              >
                <Pencil />
                Edit user
              </Button>
            </div>
          }
          description="Workspace access, role, and account information."
          title={user.name}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Profile</CardTitle>
              <CardDescription>Account details for this workspace member.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
              <UserAvatar name={user.name} />
              <div className="min-w-0 space-y-3">
                <div>
                  <p className="text-base font-medium text-ink-black">{user.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm break-all text-warm-gray">
                    <Mail className="size-3.5 shrink-0" />
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="gap-1.5 bg-sky-wash/40 text-cyan-edge">
                    <ShieldCheck className="size-3.5" />
                    {roleLabels[user.role] ?? user.role}
                  </Badge>
                  <Badge
                    className="rounded-full bg-stone-muted/30 px-2.5 py-1 text-warm-gray"
                    variant="outline"
                  >
                    Added {formatDate(user.createdAt)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle>Remove access</CardTitle>
              <CardDescription>
                This removes the user from this workspace. Their account is not deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {removeError ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <AlertDescription className="text-destructive">{removeError}</AlertDescription>
                </Alert>
              ) : null}
              <AlertDialog onOpenChange={setIsRemoveDialogOpen} open={isRemoveDialogOpen}>
                <AlertDialogTrigger
                  render={
                    <Button className="w-full" disabled={isRemoving} variant="destructive">
                      <Trash2 />
                      {isRemoving ? "Removing..." : "Remove from workspace"}
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove {user.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes the user from this workspace. Their account is not deleted, and
                      they can be added back at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isRemoving}
                      onClick={handleRemove}
                      variant="destructive"
                    >
                      {isRemoving ? "Removing..." : "Remove from workspace"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="grid gap-2 px-6 py-4 text-xs sm:grid-cols-[auto_1fr]">
            <span className="font-medium text-warm-gray">User ID</span>
            <code className="font-mono break-all text-ink-black">{user.userId}</code>
          </CardContent>
        </Card>
      </div>
    </main>
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
    <Avatar className="size-16 rounded-2xl bg-stone-muted/40">
      <AvatarFallback className="rounded-2xl bg-stone-muted/40 text-xl font-medium text-warm-gray">
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
