import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Building2, Loader2 } from "lucide-react";
import { type ChangeEvent, type FormEvent, useCallback, useId, useState } from "react";
import { object, optional, string } from "valibot";

import { pm } from "@/aspen/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/env";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const data = await orpc.auth.getSession();
    if (data?.session && data?.user) {
      throw redirect({ to: "/dashboard" });
    }
    return data;
  },
  component: LoginPage,
  loader: async ({ location }) => {
    const redirectTo = new URL(location.href, "http://tenant-application.local").searchParams.get(
      "redirect",
    );
    const data = await orpc.organizations.bySubdomain().catch(() => ({
      organization: null,
      subdomain: null,
    }));
    if (!data.subdomain) {
      throw redirect({
        search: redirectTo ? { redirect: redirectTo } : {},
        to: "/account/organizations",
      });
    }
    return data;
  },
  validateSearch: object({ redirect: optional(string()) }),
});

function LoginPage() {
  const navigate = useNavigate();
  const data = Route.useLoaderData();
  const { redirect: redirectTo } = Route.useSearch();
  const { organization, subdomain } = data;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  const handleEmailChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => setEmail(ev.target.value),
    [],
  );
  const handlePasswordChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value),
    [],
  );

  const onSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault();
      setErr(null);
      setLoading(true);

      const { error } = await pm.auth.client.signIn.email({ email, password });
      if (error) {
        setErr(error.message ?? "Login failed");
      } else {
        const target =
          redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/dashboard";
        navigate({ to: target });
      }

      setLoading(false);
    },
    [email, password, navigate, redirectTo],
  );

  const showUnavailableMethod = useCallback((method: string) => {
    setErr(`${method} sign-in is not configured for this workspace.`);
  }, []);
  const handleBackToOptions = useCallback(() => {
    setErr(null);
    setShowEmailForm(false);
  }, []);
  const handleEmailOption = useCallback(() => {
    setErr(null);
    setShowEmailForm(true);
  }, []);
  const handleGoogleOption = useCallback(
    () => showUnavailableMethod("Google"),
    [showUnavailableMethod],
  );
  const handleSamlOption = useCallback(
    () => showUnavailableMethod("SAML SSO"),
    [showUnavailableMethod],
  );
  const handlePasskeyOption = useCallback(
    () => showUnavailableMethod("Passkey"),
    [showUnavailableMethod],
  );

  if (subdomain && !organization) {
    const apexUrl = `${env.PUBLIC_WEB_SSL ? "https" : "http"}://${env.PUBLIC_WEB_DOMAIN}${env.PUBLIC_WEB_PORT ? `:${env.PUBLIC_WEB_PORT}` : ""}`;

    return (
      <main className="flex min-h-svh items-center justify-center bg-stone-canvas px-4 py-12 font-sans text-ink-black">
        <Card className="w-full max-w-sm p-6 text-center shadow-[var(--shadow-md)]">
          <span className="mx-auto mb-5 flex size-10 items-center justify-center rounded-full bg-stone-muted/40 text-ink-black">
            <Building2 className="size-5" />
          </span>
          <h1 className="font-roobert text-lg font-medium tracking-[-0.8px] text-ink-black">
            Organization: {subdomain}
          </h1>
          <p className="mt-2 text-sm text-warm-gray">
            This organization does not exist or is no longer active.
          </p>
          <Button
            className="mt-6 w-full"
            nativeButton={false}
            render={<a aria-label="Return to Global Sign-In Page" href={apexUrl} />}
            size="lg"
          >
            Return to Global Sign-In Page
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-stone-canvas px-4 py-12 font-sans text-ink-black">
      <div className="w-full max-w-72">
        <div className="flex flex-col items-center">
          <span className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-ink-black text-white">
            <Building2 className="size-5" />
          </span>
          <h1 className="mt-9 font-roobert text-lg font-medium tracking-[-0.8px] text-ink-black">
            Log in to {organization?.name ?? "Tenant Application"}
          </h1>
        </div>

        {showEmailForm ? (
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            {Boolean(err) && (
              <Alert variant="destructive">
                <AlertCircle className="size-4 shrink-0" />
                <AlertDescription className="font-medium text-destructive">{err}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 block text-xs" htmlFor={emailId}>
                  Email
                </Label>
                <Input
                  autoComplete="email"
                  className="h-11"
                  id={emailId}
                  name="email"
                  onChange={handleEmailChange}
                  placeholder="you@company.com"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div>
                <Label className="mb-1.5 block text-xs" htmlFor={passwordId}>
                  Password
                </Label>
                <Input
                  autoComplete="current-password"
                  className="h-11"
                  id={passwordId}
                  name="password"
                  onChange={handlePasswordChange}
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>

            <Button className="w-full" disabled={loading} size="lg" type="submit">
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Continue"
              )}
            </Button>
            <Button
              className="block w-full py-1 text-center text-xs text-warm-gray hover:text-ink-black"
              onClick={handleBackToOptions}
              size="xs"
              type="button"
              variant="ghost"
            >
              Back to sign-in options
            </Button>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            {Boolean(err) && (
              <Alert variant="destructive">
                <AlertCircle className="size-4 shrink-0" />
                <AlertDescription className="font-medium text-destructive">{err}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full" onClick={handleGoogleOption} size="lg" type="button">
              Continue with Google
            </Button>
            <Button
              className="w-full"
              onClick={handleEmailOption}
              size="lg"
              type="button"
              variant="secondary"
            >
              Continue with email
            </Button>
            <Button
              className="w-full"
              onClick={handleSamlOption}
              size="lg"
              type="button"
              variant="outline"
            >
              Continue with SAML SSO
            </Button>
            <Button
              className="w-full"
              onClick={handlePasskeyOption}
              size="lg"
              type="button"
              variant="outline"
            >
              Log in with passkey
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
