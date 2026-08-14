import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import css from "../styles.css?url";
import { Devtools } from "@/components/devtools";

// Const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    links: [{ href: css, rel: "stylesheet" }],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "Tenant Application" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />*/}
        <HeadContent />
      </head>
      <body className="bg-stone-canvas font-sans text-sm wrap-anywhere text-ink-black antialiased">
        {children}
        <Devtools />
        <Scripts />
      </body>
    </html>
  );
}
