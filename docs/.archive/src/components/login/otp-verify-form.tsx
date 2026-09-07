import { IconLoader2 } from "@tabler/icons-react";

import { OTPInput } from "#/components/login/otp-input";
import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import { ErrorAlert } from "./error-alert";

interface OTPVerifyFormProps {
	changeRecipientLabel: string;
	countdown: number;
	error: string | null;
	isSubmitting: boolean;
	onChangeRecipient: () => void;
	onComplete: (otp: string) => void;
	onOTPChange: (otp: string) => void;
	onResend: () => void;
	otp: string;
	recipient: React.ReactNode;
}

export function OTPVerifyForm({
	recipient,
	otp,
	onOTPChange,
	onComplete,
	error,
	isSubmitting,
	countdown,
	onResend,
	onChangeRecipient,
	changeRecipientLabel,
}: OTPVerifyFormProps) {
	return (
		<div className="space-y-4">
			<div className="text-center">
				<p className="mb-1 text-muted-foreground text-sm">We sent a code to</p>
				<p className="font-medium">{recipient}</p>
			</div>

			<div className="space-y-2">
				<Label>Enter verification code</Label>
				<div className="flex justify-center">
					<OTPInput
						disabled={isSubmitting}
						error={!!error}
						length={6}
						onChange={onOTPChange}
						onComplete={onComplete}
						value={otp}
					/>
				</div>
			</div>

			{error ? <ErrorAlert centered message={error} /> : null}

			<div className="flex items-center justify-center gap-2">
				<Button
					disabled={isSubmitting}
					onClick={onChangeRecipient}
					size="sm"
					variant="ghost"
				>
					{changeRecipientLabel}
				</Button>
				<span className="text-muted-foreground">|</span>
				<Button
					disabled={isSubmitting || countdown > 0}
					onClick={onResend}
					size="sm"
					variant="ghost"
				>
					{countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
				</Button>
			</div>

			{isSubmitting ? (
				<div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
					<IconLoader2 className="h-4 w-4 animate-spin" />
					Verifying...
				</div>
			) : null}
		</div>
	);
}
