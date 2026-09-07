import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import PostHogProvider from "#/posthog/provider";
import TanStackQueryDevtools from "#/tanstack-query/devtools";
import TanStackQueryProvider from "#/tanstack-query/root-provider";

// import { ThemeProvider } from "#/components/theme/provider";

import css from "./styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		links: [{ href: css, rel: "stylesheet" }],
		meta: [
			{ charSet: "utf-8" },
			{ content: "width=device-width, initial-scale=1", name: "viewport" },
			{ title: "Shaun - Integrated HIMS and ERP" },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				{/*<ThemeProvider />*/}
				<HeadContent />
			</head>
			<body className="wrap-anywhere cursor-default font-sans antialiased selection:bg-primary/20">
				<PostHogProvider>
					<TanStackQueryProvider>
						{children}
						<TanStackDevtools
							config={{ position: "bottom-right" }}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
								TanStackQueryDevtools,
							]}
						/>
					</TanStackQueryProvider>
				</PostHogProvider>
				<Scripts />
			</body>
		</html>
	);
}
