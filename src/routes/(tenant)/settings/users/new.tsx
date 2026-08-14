import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";
import { useCallback } from "react";

import { UserForm, type UserFormValues } from "./-user-form";
import { NewEntityPage } from "@/components/pages/new-entity";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(tenant)/settings/users/new")({
  component: NewUserPage,
});

function NewUserPage() {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values: UserFormValues) => {
      await orpc.users.create(values);
      await navigate({ to: "/settings/users" });
    },
    [navigate],
  );
  const handleCancel = useCallback(() => navigate({ to: "/settings/users" }), [navigate]);

  return (
    <main className="bg-stone-canvas p-4 sm:p-8">
      <NewEntityPage
        backHref="/settings/users"
        description="Create an account and give someone access to this workspace."
        domain="users"
        icon={UsersRound}
        title="Add user"
      >
        <UserForm
          initialValues={{ email: "", name: "", password: "", role: "member" }}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </NewEntityPage>
    </main>
  );
}
