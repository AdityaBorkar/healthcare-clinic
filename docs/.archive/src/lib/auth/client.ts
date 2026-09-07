import {
	adminClient,
	emailOTPClient,
	phoneNumberClient,
	usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { access_control, roles } from "./rbac";

export const auth = createAuthClient({
	plugins: [
		adminClient(
			// { ac: access_control, roles }
		),
		emailOTPClient(),
		usernameClient(),
		phoneNumberClient(),
	],
});

export const {
	signOut,
	useSession,
	getSession,
	signIn,
	listSessions,
	revokeSession,
} = auth;
