import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import {
	Building2,
	KeyRound,
	Loader2,
	Lock,
	Mail,
	Phone,
	User,
} from "lucide-react";
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
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { orpc } from "#/lib/rpc";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ search }) => {
		const { organization, subdomain } = await orpc.organizations
			.bySubdomain()
			.catch(() => ({ organization: null }));
		if (subdomain && !organization) {
			throw redirect({ to: "/not-found" });
		}

		const session = await orpc.auth.getSession();
		if (session) {
			if (organization) {
				throw redirect({ to: search?.redirect ?? "/dashboard" });
			}
			throw redirect({ to: "/account/organizations" });
		}

		return { organization };
	},
	component: LoginPage,
	validateSearch: object({ redirect: optional(string()) }),
});

type AuthMethod = "password" | "otp" | null;
type IdentifierKind = "email" | "phone" | "username";

function detectIdentifierKind(raw: string): IdentifierKind {
	const value = raw.trim();
	if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
		return "email";
	}
	const digits = value.replace(/[\s\-().]/g, "");
	if (/^\+?\d{7,15}$/.test(digits)) {
		return "phone";
	}
	return "username";
}

const IDENTIFIER_ICON = {
	email: Mail,
	phone: Phone,
	username: User,
} as const;

type AuthResult = Promise<{ error: { message?: string } | null }>;
type PluginSignIn = {
	username: (input: { password: string; username: string }) => AuthResult;
	phoneNumber: (input: { password: string; phoneNumber: string }) => AuthResult;
	emailOtp: (input: { email: string; otp: string }) => AuthResult;
};
type PluginEmailOtp = {
	sendVerificationOtp: (input: {
		email: string;
		type: "sign-in";
	}) => AuthResult;
};
type PluginPhoneNumber = {
	sendOtp: (input: { phoneNumber: string }) => AuthResult;
	verify: (input: { code: string; phoneNumber: string }) => AuthResult;
};

// The platform AuthUnit's static `AuthClient` type only infers the base
// `signIn.email` endpoint, but the dynamic client proxy serves every mounted
// better-auth plugin route (username, phone-number, email-otp) at runtime.
// These narrow casts recover those routes without touching the sibling repo.
const pluginSignIn = pm.auth.client.signIn as typeof pm.auth.client.signIn &
	PluginSignIn;
const pluginEmailOtp = (
	pm.auth.client as unknown as { emailOtp: PluginEmailOtp }
).emailOtp;
const pluginPhoneNumber = (
	pm.auth.client as unknown as { phoneNumber: PluginPhoneNumber }
).phoneNumber;

function LoginPage() {
	const { organization } = Route.useRouteContext();
	const { redirect: redirectTo } = Route.useSearch();
	const navigate = useNavigate();
	const router = useRouter();

	const [method, setMethod] = useState<AuthMethod>(null);
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sendingOtp, setSendingOtp] = useState(false);
	const identifierId = useId();
	const passwordId = useId();
	const otpId = useId();

	const isOrgContext = Boolean(organization);
	const title = isOrgContext
		? `Log in to ${organization?.name}`
		: "Sign in to Shaun Healthcare Management System";

	const detectedKind = detectIdentifierKind(identifier);
	const IdentifierIcon = IDENTIFIER_ICON[detectedKind];

	const handleIdentifierChange = useCallback(
		(ev: ChangeEvent<HTMLInputElement>) => setIdentifier(ev.target.value),
		[],
	);
	const handlePasswordChange = useCallback(
		(ev: ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value),
		[],
	);
	const handleOtpChange = useCallback(
		(ev: ChangeEvent<HTMLInputElement>) =>
			setOtp(ev.target.value.replace(/\D/g, "").slice(0, 6)),
		[],
	);

	const handleAuthSuccess = useCallback(async () => {
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
	}, [navigate, redirectTo, isOrgContext, router]);

	const onPasswordSubmit = useCallback(
		async (ev: FormEvent) => {
			ev.preventDefault();
			const value = identifier.trim();
			if (!value || !password) {
				toast.error(
					"Enter your username, email, or phone number and password.",
				);
				return;
			}
			setLoading(true);

			const kind = detectIdentifierKind(value);
			const { error } =
				kind === "email"
					? await pm.auth.client.signIn.email({ email: value, password })
					: kind === "username"
						? await pluginSignIn.username({
								password,
								username: value,
							})
						: await pluginSignIn.phoneNumber({
								password,
								phoneNumber: value,
							});
			if (error) {
				toast.error(error.message ?? "Login failed");
				setLoading(false);
				return;
			}

			setLoading(false);
			await handleAuthSuccess();
		},
		[identifier, password, handleAuthSuccess],
	);

	const onSendOtp = useCallback(async () => {
		const value = identifier.trim();
		if (!value) {
			toast.error("Enter your email or phone number to receive an OTP.");
			return;
		}
		const kind = detectIdentifierKind(value);
		if (kind === "username") {
			toast.error(
				"OTP sign-in needs an email address or phone number, not a username.",
			);
			return;
		}
		setSendingOtp(true);
		const { error } =
			kind === "email"
				? await pluginEmailOtp.sendVerificationOtp({
						email: value,
						type: "sign-in",
					})
				: await pluginPhoneNumber.sendOtp({ phoneNumber: value });
		setSendingOtp(false);
		if (error) {
			toast.error(error.message ?? "Failed to send OTP");
			return;
		}
		setOtpSent(true);
		toast.success(
			kind === "email"
				? `OTP sent to ${value}`
				: `OTP sent to ${value} via SMS`,
		);
	}, [identifier]);

	const onVerifyOtp = useCallback(
		async (ev: FormEvent) => {
			ev.preventDefault();
			const value = identifier.trim();
			if (!value || !otp) {
				toast.error("Enter the OTP sent to you.");
				return;
			}
			const kind = detectIdentifierKind(value);
			if (kind === "username") {
				toast.error(
					"OTP sign-in needs an email address or phone number, not a username.",
				);
				return;
			}
			setLoading(true);
			const { error } =
				kind === "email"
					? await pluginSignIn.emailOtp({ email: value, otp })
					: await pluginPhoneNumber.verify({
							code: otp,
							phoneNumber: value,
						});
			if (error) {
				toast.error(error.message ?? "OTP verification failed");
				setLoading(false);
				return;
			}
			setLoading(false);
			await handleAuthSuccess();
		},
		[identifier, otp, handleAuthSuccess],
	);

	const handleChangeIdentifier = useCallback(() => {
		setOtpSent(false);
		setOtp("");
	}, []);
	const showUnavailableMethod = useCallback((methodName: string) => {
		toast.error(`${methodName} sign-in is disabled for this workspace.`);
	}, []);
	const handleBackToOptions = useCallback(() => {
		setMethod(null);
		setPassword("");
		setOtp("");
		setOtpSent(false);
	}, []);
	const handlePasswordOption = useCallback(() => {
		setMethod("password");
		setOtp("");
		setOtpSent(false);
	}, []);
	const handleOtpOption = useCallback(() => {
		setMethod("otp");
		setPassword("");
		setOtp("");
		setOtpSent(false);
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

				{method === "password" ? (
					<form className="mt-6 space-y-4" onSubmit={onPasswordSubmit}>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor={identifierId}>
									Username / Email / Phone Number
								</Label>
								<div className="relative">
									<IdentifierIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-warm-gray" />
									<Input
										autoComplete="username"
										className="h-11 pl-10"
										id={identifierId}
										name="identifier"
										onChange={handleIdentifierChange}
										placeholder="username, you@company.com, or +91…"
										required
										type="text"
										value={identifier}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor={passwordId}>Password</Label>
								<div className="relative">
									<Lock className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-warm-gray" />
									<Input
										autoComplete="current-password"
										className="h-11 pl-10"
										id={passwordId}
										name="password"
										onChange={handlePasswordChange}
										placeholder="Enter your password"
										required
										type="password"
										value={password}
									/>
								</div>
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
							className="block w-full py-1 text-center text-xs text-warm-gray"
							onClick={handleBackToOptions}
							size="xs"
							type="button"
							variant="ghost"
						>
							Back to sign-in options
						</Button>
					</form>
				) : method === "otp" ? (
					<div className="mt-6 space-y-4">
						<div className="space-y-2">
							<Label htmlFor={identifierId}>
								Username / Email / Phone Number
							</Label>
							<div className="relative">
								<IdentifierIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-warm-gray" />
								<Input
									autoComplete="username"
									className="h-11 pl-10"
									disabled={otpSent}
									id={identifierId}
									name="identifier"
									onChange={handleIdentifierChange}
									placeholder="username, you@company.com, or +91…"
									required
									type="text"
									value={identifier}
								/>
							</div>
							{detectedKind === "username" && identifier.trim() ? (
								<p className="text-xs text-warm-gray">
									OTP needs an email or phone number
								</p>
							) : null}
						</div>

						{otpSent ? (
							<form className="space-y-4" onSubmit={onVerifyOtp}>
								<div className="space-y-2">
									<Label htmlFor={otpId}>Enter OTP</Label>
									<div className="relative">
										<KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-warm-gray" />
										<Input
											autoComplete="one-time-code"
											className="h-11 pl-10 tracking-widest"
											id={otpId}
											inputMode="numeric"
											maxLength={6}
											name="otp"
											onChange={handleOtpChange}
											placeholder="6-digit code"
											required
											type="text"
											value={otp}
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
											Verifying...
										</>
									) : (
										"Verify OTP"
									)}
								</Button>
								<div className="flex items-center justify-between">
									<Button
										className="px-0 text-xs text-warm-gray"
										disabled={sendingOtp}
										onClick={onSendOtp}
										size="xs"
										type="button"
										variant="ghost"
									>
										{sendingOtp ? "Resending..." : "Resend OTP"}
									</Button>
									<Button
										className="px-0 text-xs text-warm-gray"
										onClick={handleChangeIdentifier}
										size="xs"
										type="button"
										variant="ghost"
									>
										Change identifier
									</Button>
								</div>
							</form>
						) : (
							<Button
								className="w-full"
								disabled={sendingOtp}
								onClick={onSendOtp}
								size="lg"
								type="button"
							>
								{sendingOtp ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Sending OTP...
									</>
								) : (
									"Send OTP"
								)}
							</Button>
						)}
						<Button
							className="block w-full py-1 text-center text-xs text-warm-gray"
							onClick={handleBackToOptions}
							size="xs"
							type="button"
							variant="ghost"
						>
							Back to sign-in options
						</Button>
					</div>
				) : (
					<div className="mt-6 space-y-3">
						<Button
							className="w-full"
							onClick={handleOtpOption}
							size="lg"
							type="button"
						>
							Continue with OTP
						</Button>
						<Button
							className="w-full"
							onClick={handlePasswordOption}
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
				{method === null ? (
					<p className="mt-6 text-center text-xs text-warm-gray">
						New here?{" "}
						<Link
							className="font-medium hover:text-cyan-edge hover:underline"
							to="/support"
						>
							Sign Up
						</Link>{" "}
						or{" "}
						<Link
							className="font-medium hover:text-cyan-edge hover:underline"
							to="/support"
						>
							Contact Support
						</Link>
					</p>
				) : null}
			</div>
		</main>
	);
}
