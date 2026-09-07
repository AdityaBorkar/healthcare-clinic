import {
	IconAt,
	IconBuildingHospital,
	IconEye,
	IconEyeOff,
	IconLoader2,
	IconLock,
	IconMail,
	IconPhone,
	IconUser,
} from "@tabler/icons-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useCallback, useId, useState } from "react";
import * as v from "valibot";

import { ErrorAlert } from "#/components/login/error-alert";
import { LoginBrandingPanel } from "#/components/login/login-branding-panel";
import { OTPVerifyForm } from "#/components/login/otp-verify-form";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { useCountdown } from "#/hooks/use-countdown";
import { auth, getSession as getClientSession } from "#/lib/auth/client";
import { getSession } from "#/rpc/server-actions/auth";

export const Route = createFileRoute("/(public)/login")({
	beforeLoad: async ({ search }) => {
		const session =
			typeof window === "undefined"
				? await getSession()
				: (await getClientSession())?.data;
		if (session?.user) {
			const redirectPath = search.redirect ?? "/dashboard";
			throw redirect({ to: redirectPath });
		}
		return;
	},
	component: LoginPage,
	head: () => ({
		meta: [{ title: "Login (Shaun)" }],
	}),
	validateSearch: v.object({
		redirect: v.optional(v.string()),
	}),
});

type LoginMethod = "password" | "email-otp" | "phone-otp";
type OTPFlowState = "input" | "sent";

function LoginPage() {
	const baseId = useId();
	const navigate = useNavigate();
	const [activeMethod, setActiveMethod] = useState<LoginMethod>("password");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Password form state
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// Email OTP state
	const [email, setEmail] = useState("");
	const [emailOTPState, setEmailOTPState] = useState<OTPFlowState>("input");
	const [emailOTP, setEmailOTP] = useState("");
	const emailCountdown = useCountdown(60);

	// Phone OTP state
	const [phoneNumber, setPhoneNumber] = useState("");
	const [phoneOTPState, setPhoneOTPState] = useState<OTPFlowState>("input");
	const [phoneOTP, setPhoneOTP] = useState("");
	const phoneCountdown = useCountdown(60);

	const resetForm = () => {
		setError(null);
		setEmailOTPState("input");
		setPhoneOTPState("input");
		setEmailOTP("");
		setPhoneOTP("");
		emailCountdown.reset();
		phoneCountdown.reset();
	};

	const handlePasswordLogin = async () => {
		if (!userId.trim() || !password) {
			setError("Please enter your credentials");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const isEmail = userId.includes("@");
			const result = isEmail
				? await auth.signIn.email({ email: userId, password })
				: await auth.signIn.username({ password, username: userId });

			if (result.error) {
				setError(result.error.message || "Invalid credentials");
			} else {
				navigate({ to: "/" });
			}
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSendEmailOTP = async () => {
		if (!email.trim() || !email.includes("@")) {
			setError("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const result = await auth.emailOtp.sendVerificationOtp({
				email,
				type: "sign-in",
			});

			if (result.error) {
				setError(result.error.message || "Failed to send OTP");
			} else {
				setEmailOTPState("sent");
				emailCountdown.start();
			}
		} catch {
			setError("Failed to send OTP");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerifyEmailOTP = useCallback(
		async (otp: string) => {
			if (otp.length !== 6) return;

			setIsSubmitting(true);
			setError(null);

			try {
				const result = await auth.emailOtp.verifyEmail({ email, otp });

				if (result.error) {
					setError(result.error.message || "Invalid OTP");
					setEmailOTP("");
				} else {
					navigate({ to: "/" });
				}
			} catch {
				setError("Verification failed");
				setEmailOTP("");
			} finally {
				setIsSubmitting(false);
			}
		},
		[email, navigate],
	);

	const handleSendPhoneOTP = async () => {
		if (!phoneNumber.trim() || phoneNumber.length < 6) {
			setError("Please enter a valid phone number");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		const fullPhoneNumber = `+91${phoneNumber}`;

		try {
			const result = await auth.phoneNumber.sendOtp({
				phoneNumber: fullPhoneNumber,
			});

			if (result.error) {
				setError(result.error.message || "Failed to send OTP");
			} else {
				setPhoneOTPState("sent");
				phoneCountdown.start();
			}
		} catch {
			setError("Failed to send OTP");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerifyPhoneOTP = useCallback(
		async (otp: string) => {
			if (otp.length !== 6) return;

			setIsSubmitting(true);
			setError(null);

			const fullPhoneNumber = `+91${phoneNumber}`;

			try {
				const result = await auth.phoneNumber.verify({
					code: otp,
					phoneNumber: fullPhoneNumber,
				});

				if (result.error) {
					setError(result.error.message || "Invalid OTP");
					setPhoneOTP("");
				} else {
					navigate({ to: "/" });
				}
			} catch {
				setError("Verification failed");
				setPhoneOTP("");
			} finally {
				setIsSubmitting(false);
			}
		},
		[phoneNumber, navigate],
	);

	const handleOTPComplete = useCallback(
		(otp: string, type: "email" | "phone") => {
			if (type === "email") {
				handleVerifyEmailOTP(otp);
			} else {
				handleVerifyPhoneOTP(otp);
			}
		},
		[handleVerifyEmailOTP, handleVerifyPhoneOTP],
	);

	return (
		<div className="flex min-h-screen">
			<LoginBrandingPanel />

			<div className="flex flex-1 items-center justify-center bg-background p-8">
				<div className="w-full max-w-md">
					<div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
						<div className="rounded-lg bg-primary/10 p-2">
							<IconBuildingHospital className="h-6 w-6 text-primary" />
						</div>
						<span className="font-semibold text-xl">Shaun</span>
					</div>

					<div className="mb-8 text-center">
						<h2 className="font-bold text-2xl text-foreground">Welcome back</h2>
						<p className="mt-1 text-muted-foreground">
							Sign in to your account
						</p>
					</div>

					<Tabs
						className="w-full flex-col"
						onValueChange={(v) => {
							setActiveMethod(v as LoginMethod);
							resetForm();
						}}
						value={activeMethod}
					>
						<TabsList
							className="mb-6 grid w-full grid-cols-3"
							variant="default"
						>
							<TabsTrigger className="gap-1.5" value="password">
								<IconLock className="h-4 w-4" />
								<span className="hidden sm:inline">Password</span>
							</TabsTrigger>
							<TabsTrigger className="gap-1.5" value="email-otp">
								<IconMail className="h-4 w-4" />
								<span className="hidden sm:inline">Email OTP</span>
							</TabsTrigger>
							<TabsTrigger className="gap-1.5" value="phone-otp">
								<IconPhone className="h-4 w-4" />
								<span className="hidden sm:inline">Phone OTP</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent className="mt-0" value="password">
							<form
								className="space-y-4"
								onSubmit={(e) => {
									e.preventDefault();
									handlePasswordLogin();
								}}
							>
								<div className="space-y-2">
									<Label htmlFor={`${baseId}-userId`}>Email or Username</Label>
									<div className="relative">
										<div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
											{userId.includes("@") ? (
												<IconAt className="h-4 w-4" />
											) : (
												<IconUser className="h-4 w-4" />
											)}
										</div>
										<Input
											className="pl-10"
											disabled={isSubmitting}
											id={`${baseId}-userId`}
											onChange={(e) => setUserId(e.target.value)}
											placeholder="Enter your email or username"
											type="text"
											value={userId}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor={`${baseId}-password`}>Password</Label>
									<div className="relative">
										<div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
											<IconLock className="h-4 w-4" />
										</div>
										<Input
											className="pr-10 pl-10"
											disabled={isSubmitting}
											id={`${baseId}-password`}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Enter your password"
											type={showPassword ? "text" : "password"}
											value={password}
										/>
										<button
											className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
											onClick={() => setShowPassword(!showPassword)}
											type="button"
										>
											{showPassword ? (
												<IconEyeOff className="h-4 w-4" />
											) : (
												<IconEye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>

								{error ? <ErrorAlert message={error} /> : null}

								<Button
									className="w-full"
									disabled={isSubmitting || !userId.trim() || !password}
									type="submit"
								>
									{isSubmitting ? (
										<>
											<IconLoader2 className="h-4 w-4 animate-spin" />
											Signing in...
										</>
									) : (
										"Sign in"
									)}
								</Button>
							</form>
						</TabsContent>

						<TabsContent className="mt-0" value="email-otp">
							{emailOTPState === "input" ? (
								<form
									className="space-y-4"
									onSubmit={(e) => {
										e.preventDefault();
										handleSendEmailOTP();
									}}
								>
									<div className="space-y-2">
										<Label htmlFor={`${baseId}-email`}>Email Address</Label>
										<div className="relative">
											<div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
												<IconAt className="h-4 w-4" />
											</div>
											<Input
												className="pl-10"
												disabled={isSubmitting}
												id={`${baseId}-email`}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="Enter your email address"
												type="email"
												value={email}
											/>
										</div>
									</div>

									{error ? <ErrorAlert message={error} /> : null}

									<Button
										className="w-full"
										disabled={
											isSubmitting || !email.trim() || !email.includes("@")
										}
										type="submit"
									>
										{isSubmitting ? (
											<>
												<IconLoader2 className="h-4 w-4 animate-spin" />
												Sending code...
											</>
										) : (
											"Send Code"
										)}
									</Button>
								</form>
							) : (
								<OTPVerifyForm
									changeRecipientLabel="Change email"
									countdown={emailCountdown.seconds}
									error={error}
									isSubmitting={isSubmitting}
									onChangeRecipient={() => {
										setEmailOTPState("input");
										setEmailOTP("");
										setError(null);
									}}
									onComplete={(otp) => handleOTPComplete(otp, "email")}
									onOTPChange={setEmailOTP}
									onResend={handleSendEmailOTP}
									otp={emailOTP}
									recipient={email}
								/>
							)}
						</TabsContent>

						<TabsContent className="mt-0" value="phone-otp">
							{phoneOTPState === "input" ? (
								<form
									className="space-y-4"
									onSubmit={(e) => {
										e.preventDefault();
										handleSendPhoneOTP();
									}}
								>
									<div className="space-y-2">
										<Label htmlFor={`${baseId}-phone`}>Phone Number</Label>
										<div className="relative">
											<div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
												<span className="font-medium text-sm">+91</span>
											</div>
											<Input
												className="pl-14"
												disabled={isSubmitting}
												id={`${baseId}-phone`}
												onChange={(e) =>
													setPhoneNumber(e.target.value.replace(/\D/g, ""))
												}
												placeholder="Enter phone number"
												type="tel"
												value={phoneNumber}
											/>
										</div>
									</div>

									{error ? <ErrorAlert message={error} /> : null}

									<Button
										className="w-full"
										disabled={isSubmitting || phoneNumber.length < 6}
										type="submit"
									>
										{isSubmitting ? (
											<>
												<IconLoader2 className="h-4 w-4 animate-spin" />
												Sending code...
											</>
										) : (
											"Send Code"
										)}
									</Button>
								</form>
							) : (
								<OTPVerifyForm
									changeRecipientLabel="Change number"
									countdown={phoneCountdown.seconds}
									error={error}
									isSubmitting={isSubmitting}
									onChangeRecipient={() => {
										setPhoneOTPState("input");
										setPhoneOTP("");
										setError(null);
									}}
									onComplete={(otp) => handleOTPComplete(otp, "phone")}
									onOTPChange={setPhoneOTP}
									onResend={handleSendPhoneOTP}
									otp={phoneOTP}
									recipient={`+91 ${phoneNumber}`}
								/>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
