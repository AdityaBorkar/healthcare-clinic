import { PostHogProvider as BasePostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { type ReactNode, useEffect } from "react";

interface PostHogProviderProps {
	children: ReactNode;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
	if (process.env.NODE_ENV === "production") {
		return <PostHogProductionProvider>{children}</PostHogProductionProvider>;
	}
	return <>{children}</>;
}

function PostHogProductionProvider({ children }: PostHogProviderProps) {
	useEffect(() => {
		if (typeof window !== "undefined" && import.meta.env.VITE_POSTHOG_KEY) {
			posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
				api_host:
					import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
				capture_pageview: false,
				defaults: "2025-11-30",
				person_profiles: "identified_only",
			});
		}
	}, []);
	return <BasePostHogProvider client={posthog}>{children}</BasePostHogProvider>;
}
