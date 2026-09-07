import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP, phoneNumber, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "#/lib/db/server";
import * as schema from "#/schemas/db";
import { access_control, roles } from "./rbac";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		admin(
			// { ac: access_control, roles }
		),
		username(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				console.log(`[OTP ${type.toUpperCase()}] Email: ${email}, OTP: ${otp}`);
			},
		}),
		phoneNumber({
			sendOTP: async ({ phoneNumber, code }) => {
				console.log(`[PHONE OTP] Phone: ${phoneNumber}, Code: ${code}`);
			},
		}),
		tanstackStartCookies(),
	],
});
