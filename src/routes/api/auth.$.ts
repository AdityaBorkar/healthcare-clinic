import { createFileRoute } from "@tanstack/react-router";

import { f } from "@/aspen/server";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			ANY: async ({ request }) => {
				console.log("SERVER: ", f.auth);
				return f.run(() => {
					return f.auth.server.handler(request);
				});
			},
		},
	},
});
