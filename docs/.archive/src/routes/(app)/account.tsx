import {
	IconAt,
	IconBell,
	IconLock,
	IconPalette,
	IconShield,
	IconUser,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { auth } from "#/lib/auth/client";

export const Route = createFileRoute("/(app)/account")({
	component: AccountSettings,
	head: () => ({
		meta: [{ title: "Account (Shaun)" }],
	}),
});

function AccountSettings() {
	const baseId = useId();
	const { data: session, isPending, refetch } = auth.useSession();
	const [name, setName] = useState("");
	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
	const [profileMessage, setProfileMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [passwordMessage, setPasswordMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		setIsUpdatingProfile(true);
		setProfileMessage(null);

		try {
			const result = await auth.updateUser({ name: name.trim() });
			if (result.error) {
				setProfileMessage({
					text: result.error.message || "Failed to update profile",
					type: "error",
				});
			} else {
				setProfileMessage({
					text: "Profile updated successfully!",
					type: "success",
				});
				setName("");
				refetch();
			}
		} catch {
			setProfileMessage({
				text: "An unexpected error occurred",
				type: "error",
			});
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordMessage(null);

		if (newPassword !== confirmPassword) {
			setPasswordMessage({ text: "New passwords do not match", type: "error" });
			return;
		}

		if (newPassword.length < 8) {
			setPasswordMessage({
				text: "Password must be at least 8 characters",
				type: "error",
			});
			return;
		}

		setIsChangingPassword(true);

		try {
			const result = await auth.changePassword({
				currentPassword,
				newPassword,
				revokeOtherSessions: true,
			});

			if (result.error) {
				setPasswordMessage({
					text: result.error.message || "Failed to change password",
					type: "error",
				});
			} else {
				setPasswordMessage({
					text: "Password changed successfully! Other sessions have been revoked.",
					type: "success",
				});
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			}
		} catch {
			setPasswordMessage({
				text: "An unexpected error occurred",
				type: "error",
			});
		} finally {
			setIsChangingPassword(false);
		}
	};

	if (isPending) {
		return (
			<div className="container mx-auto max-w-2xl p-6">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className="container mx-auto max-w-2xl p-6">
				<div className="text-muted-foreground">Not authenticated</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-2xl space-y-6 p-6">
			<div>
				<h1 className="font-bold text-2xl">Account Settings</h1>
				<p className="text-muted-foreground">
					Manage your profile and account preferences
				</p>
			</div>

			{/* Current User Info */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconUser className="h-5 w-5 text-primary" />
						<CardTitle>Current Profile</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<Label className="text-muted-foreground">Name</Label>
							<div className="mt-1 font-medium">{session.user.name}</div>
						</div>
						<div>
							<Label className="text-muted-foreground">Email</Label>
							<div className="mt-1 flex items-center gap-2">
								<IconAt className="h-4 w-4 text-muted-foreground" />
								<span className="font-medium">{session.user.email}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Update Profile */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconUser className="h-5 w-5 text-primary" />
						<CardTitle>Update Profile</CardTitle>
					</div>
					<CardDescription>Change your display name</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleUpdateProfile}>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-name`}>New Name</Label>
							<Input
								id={`${baseId}-name`}
								onChange={(e) => setName(e.target.value)}
								placeholder={session.user.name}
								value={name}
							/>
						</div>
						{profileMessage ? (
							<div
								className={`rounded-lg px-4 py-2 text-sm ${
									profileMessage.type === "success"
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{profileMessage.text}
							</div>
						) : null}
						<Button disabled={isUpdatingProfile || !name.trim()} type="submit">
							{isUpdatingProfile ? "Updating..." : "Update Name"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{/* Change Password */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconLock className="h-5 w-5 text-primary" />
						<CardTitle>Change Password</CardTitle>
					</div>
					<CardDescription>
						Update your password and revoke other sessions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleChangePassword}>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-currentPassword`}>
								Current Password
							</Label>
							<Input
								id={`${baseId}-currentPassword`}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
								type="password"
								value={currentPassword}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-newPassword`}>New Password</Label>
							<Input
								id={`${baseId}-newPassword`}
								minLength={8}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								type="password"
								value={newPassword}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`${baseId}-confirmPassword`}>
								Confirm New Password
							</Label>
							<Input
								id={`${baseId}-confirmPassword`}
								minLength={8}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								type="password"
								value={confirmPassword}
							/>
						</div>
						{passwordMessage ? (
							<div
								className={`rounded-lg px-4 py-2 text-sm ${
									passwordMessage.type === "success"
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{passwordMessage.text}
							</div>
						) : null}
						<Button
							disabled={
								isChangingPassword ||
								!currentPassword ||
								!newPassword ||
								!confirmPassword
							}
							type="submit"
						>
							{isChangingPassword ? "Changing Password..." : "Change Password"}
						</Button>
					</form>
				</CardContent>
			</Card>

			<div>
				<h1 className="font-bold text-2xl">Security</h1>
				<p className="text-muted-foreground">
					Manage security settings and session access
				</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconShield className="h-5 w-5 text-primary" />
						<CardTitle>Security Settings</CardTitle>
					</div>
					<CardDescription>
						Two-factor authentication, active sessions, and audit logs
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-muted-foreground">Security settings coming soon</p>
					<p className="text-muted-foreground text-sm">
						Enable 2FA, manage sessions, and view audit history
					</p>
				</CardContent>
			</Card>

			<div>
				<h1 className="font-bold text-2xl">Notifications</h1>
				<p className="text-muted-foreground">
					Configure how you receive alerts and updates
				</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconBell className="h-5 w-5 text-primary" />
						<CardTitle>Notification Preferences</CardTitle>
					</div>
					<CardDescription>
						Manage email, push, and in-app notifications
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-muted-foreground">
						Notification settings coming soon
					</p>
					<p className="text-muted-foreground text-sm">
						Configure alerts for appointments, billing, and more
					</p>
				</CardContent>
			</Card>

			<div>
				<h1 className="font-bold text-2xl">Appearance</h1>
				<p className="text-muted-foreground">
					Customize the look and feel of the application
				</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconPalette className="h-5 w-5 text-primary" />
						<CardTitle>Theme Settings</CardTitle>
					</div>
					<CardDescription>Configure display preferences</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<p className="text-muted-foreground">Theme settings coming soon</p>
					<p className="text-muted-foreground text-sm">
						Customize colors, fonts, and layout preferences
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
