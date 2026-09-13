import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { Building2, Loader2 } from "lucide-react";
import {
	type ChangeEvent,
	type FormEvent,
	useCallback,
	useId,
	useState,
} from "react";
import { toast } from "sonner";
import { object, optional, string } from "valibot";

import { pm } from "#/aspen/client";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { BASE_URL } from "#/env";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ search }) => {
		const result = await orpc.organizations.bySubdomain().catch(() => ({
			organization: null,
			subdomain: null,
		}));
		// Narrow to serializable branding fields (TanStack Start validates
		// beforeLoad return values; metadata: unknown is not serializable).
		const organization = result.organization
			? {
					logo: result.organization.logo,
					name: result.organization.name,
					slug: result.organization.slug,
				}
			: null;
		const subdomain = result.subdomain;

		const session = await orpc.auth.getSession();
		if (session) {
			const redirectTo = search?.redirect;
			const safeRedirect =
				redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
					? redirectTo
					: null;
			if (subdomain && organization) {
				throw redirect({ to: safeRedirect ?? "/dashboard" });
			}
			throw redirect({ to: "/account/organizations" });
		}

		return { organization, subdomain };
	},
	component: IndexPage,
	validateSearch: object({ redirect: optional(string()) }),
});

function IndexPage() {
	const { organization, subdomain } = Route.useRouteContext();
	const { redirect: redirectTo } = Route.useSearch();
	const navigate = useNavigate();
	const router = useRouter();

	if (subdomain && !organization) {
		return <OrganizationNotExists subdomain={subdomain} />;
	}

	return (
		<LoginView
			navigate={navigate}
			organization={organization}
			redirectTo={redirectTo}
			router={router}
			subdomain={subdomain}
		/>
	);
}

function OrganizationNotExists({ subdomain }: { subdomain: string }) {
	return (
		<main className="flex min-h-svh items-center justify-center bg-stone-canvas px-4 py-12 font-sans ">
			<Card className="w-full max-w-sm p-6 text-center shadow-shadow-md">
				<span className="mx-auto mb-5 flex size-10 items-center justify-center rounded-full bg-stone-muted/40 ">
					<Building2 className="size-5" />
				</span>
				<h1 className=" text-lg font-medium  ">Organization: {subdomain}</h1>
				<p className="mt-2 text-sm text-warm-gray">
					This organization does not exist or is no longer active.
				</p>
				<Button
					className="mt-6 w-full"
					nativeButton={false}
					render={
						<a aria-label="Return to Global Sign-In Page" href={BASE_URL} />
					}
					size="lg"
				>
					Return to Global Sign-In Page
				</Button>
			</Card>
		</main>
	);
}

type LoginOrganization = {
	logo: string | null;
	name: string;
	slug: string;
} | null;

function LoginView({
	organization,
	subdomain,
	redirectTo,
	navigate,
	router,
}: {
	organization: LoginOrganization;
	subdomain: string | null;
	redirectTo: string | undefined;
	navigate: ReturnType<typeof useNavigate>;
	router: ReturnType<typeof useRouter>;
}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showEmailForm, setShowEmailForm] = useState(false);
	const emailId = useId();
	const passwordId = useId();

	const isOrgContext = Boolean(subdomain && organization);
	const title = isOrgContext
		? `Log in to ${organization?.name}`
		: "Sign in to Shaun Healthcare Management System";

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
			setLoading(true);

			const { error } = await pm.auth.client.signIn.email({ email, password });
			if (error) {
				toast.error(error.message ?? "Login failed");
				setLoading(false);
				return;
			}

			setLoading(false);
			await router.invalidate();

			const safeRedirect =
				redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
					? redirectTo
					: null;
			if (safeRedirect) {
				navigate({ to: safeRedirect });
			} else if (isOrgContext) {
				navigate({ to: "/dashboard" });
			} else {
				navigate({ to: "/account/organizations" });
			}
		},
		[email, password, navigate, redirectTo, isOrgContext, router],
	);

	const showUnavailableMethod = useCallback((method: string) => {
		toast.error(`${method} sign-in is disabled for this workspace.`);
	}, []);
	const handleBackToOptions = useCallback(() => {
		setShowEmailForm(false);
	}, []);
	const handleEmailOption = useCallback(() => {
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

	return (
		<main className="flex min-h-svh items-center justify-center bg-stone-canvas px-4 py-12 font-sans ">
			<div className="w-full max-w-72">
				<div className="flex flex-col items-center">
					{organization?.logo ? (
						<img
							alt={`${organization.name} logo`}
							className="size-10 rounded-full object-cover"
							src={organization.logo}
						/>
					) : (
						<span className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-ink-black text-white">
							<Building2 className="size-5" />
						</span>
					)}
					<h1 className="mt-9 text-center text-lg font-medium">{title}</h1>
				</div>

				{showEmailForm ? (
					<form className="mt-5 space-y-4" onSubmit={onSubmit}>
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

						<Button
							className="w-full"
							disabled={loading}
							size="lg"
							type="submit"
						>
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
							className="block w-full py-1 text-center text-xs text-warm-gray hover:"
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
						<Button
							className="w-full"
							onClick={handleEmailOption}
							size="lg"
							type="button"
						>
							Continue with OTP
						</Button>
						<Button
							className="w-full"
							onClick={handleEmailOption}
							size="lg"
							type="button"
							variant="secondary"
						>
							Continue with Password
						</Button>
						<Button
							className="w-full"
							onClick={handlePasskeyOption}
							size="lg"
							type="button"
							variant="secondary"
						>
							Continue with Passkey
						</Button>
						<Button
							className="w-full"
							onClick={handleGoogleOption}
							size="lg"
							type="button"
							variant="secondary"
						>
							Continue with Google
						</Button>
						<Button
							className="w-full"
							onClick={handleSamlOption}
							size="lg"
							type="button"
							variant="secondary"
						>
							Continue with SAML SSO
						</Button>
					</div>
				)}
				<p className="mt-6 text-center text-xs text-warm-gray">
					New here?{" "}
					<Link
						className="font-medium  hover:text-cyan-edge hover:underline"
						to="/support"
					>
						Sign Up
					</Link>{" "}
					or{" "}
					<Link
						className="font-medium  hover:text-cyan-edge hover:underline"
						to="/support"
					>
						Contact Support
					</Link>
				</p>
			</div>
		</main>
	);
}
