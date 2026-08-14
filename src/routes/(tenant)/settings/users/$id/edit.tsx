import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, UsersRound } from "lucide-react";
import { useCallback } from "react";

import { UserForm, type UserFormValues } from "../-user-form";
import { NewEntityPage } from "@/components/pages/new-entity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)/settings/users/$id/edit")({
  component: EditUserPage,
  loader: async ({ params }) => {
    try {
      return await orpc.users.get({ id: params.id });
    } catch (error) {
      console.error("Failed to load user", error);
      return null;
    }
  },
});

function EditUserPage() {
  const user = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values: UserFormValues) => {
      if (!user) {
        return;
      }

      await orpc.users.update({
        id: user.id,
        patch: {
          name: values.name,
          ...(user.role === "owner" ? {} : { role: values.role }),
        },
      });
      await navigate({
        params: { id: user.id },
        to: "/settings/users/$id",
      });
    },
    [navigate, user],
  );
  const handleCancel = useCallback(() => {
    if (!user) {
      navigate({ to: "/settings/users" });
      return;
    }

    navigate({ params: { id: user.id }, to: "/settings/users/$id" });
  }, [navigate, user]);

  if (!user) {
    return (
      <main className="bg-stone-canvas p-4 sm:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Button nativeButton={false} render={<Link to="/settings/users" />} variant="outline">
            <ArrowLeft />
            Back to users
          </Button>
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-sm font-medium text-ink-black">We could not find this user</p>
              <p className="mt-2 text-xs text-warm-gray">
                The user may have been removed from this workspace.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const currentUser = user;

  return (
    <main className="bg-stone-canvas p-4 sm:p-8">
      <NewEntityPage
        backHref={`/settings/users/${currentUser.id}`}
        description="Update this user's name or workspace access level."
        domain="users"
        icon={UsersRound}
        title={`Edit ${currentUser.name}`}
      >
        <UserForm
          initialValues={{
            email: currentUser.email,
            name: currentUser.name,
            password: "",
            role: currentUser.role === "admin" ? "admin" : "member",
          }}
          isEditing
          isOwner={currentUser.role === "owner"}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </NewEntityPage>
    </main>
  );
}
