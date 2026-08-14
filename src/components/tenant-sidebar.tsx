import { Link } from "@tanstack/react-router";
import {
  Bell,
  type LucideIcon,
  ContactRound,
  Files,
  LayoutList,
  ListChecks,
  LogOut,
  MessageSquare,
  Pin,
  Plus,
  Search,
  Tags,
  Trash2,
  Workflow,
} from "lucide-react";
import { LayoutGroup } from "motion/react";

import { SidebarHoverItem } from "@/components/sidebar-hover-item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WorkspaceSelector } from "@/components/workspace-selector";

type Organization = {
  logo: string | null;
  name: string;
};

type User = {
  name: string;
};

const pinnedDocumentClasses = ["Contracts", "Invoices", "Policies"];
const pinnedDocumentViews = ["Recently Updated", "My Documents", "Shared with Me"];

export function TenantSidebar({
  onSignOut,
  organization,
  user,
}: {
  onSignOut: () => void | Promise<void>;
  organization: Organization | null;
  user: User;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-stone-border bg-white text-ink-black md:sticky md:top-0 md:h-svh md:w-64 md:border-r md:border-b-0">
      <div className="border-b border-stone-border px-4 py-4">
        <WorkspaceSelector organization={organization} />
      </div>

      <div className="space-y-2 px-4 py-4">
        <Button className="w-full justify-start gap-2.5 text-sm" variant="outline">
          <Search className="size-4" />
          <span>Search</span>
          <kbd className="ml-auto rounded border border-stone-border px-1.5 py-0.5 text-[10px] text-ash-gray">
            Ctrl K
          </kbd>
        </Button>
        <Button className="w-full">
          <Plus className="size-4" />
          New
        </Button>
      </div>

      <nav aria-label="Main navigation" className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <LayoutGroup>
          <SidebarSection>
            <SidebarItem href="/notifications" icon={Bell} label="Notifications" />
            <SidebarItem href="/tasks" icon={ListChecks} label="Tasks" />
            <SidebarItem href="/workflows" icon={Workflow} label="Workflows" />
            <SidebarItem href="/documents" icon={Files} label="All Documents" />
            <SidebarItem href="/document-classes" icon={Tags} label="Document Classes" />
            <div className="space-y-0.5">
              {pinnedDocumentClasses.map((documentClass) => (
                <SidebarItem
                  href="/document-classes"
                  icon={Pin}
                  key={documentClass}
                  label={documentClass}
                  nested
                />
              ))}
            </div>
            <SidebarItem href="/document-views" icon={LayoutList} label="Document Views" />
            <div className="space-y-0.5">
              {pinnedDocumentViews.map((documentView) => (
                <SidebarItem
                  href="/document-views"
                  icon={Pin}
                  key={documentView}
                  label={documentView}
                  nested
                />
              ))}
            </div>
            <SidebarItem href="/discussions" icon={MessageSquare} label="Discussions" />
            <SidebarItem href="/contacts" icon={ContactRound} label="Contacts" />
            <SidebarItem href="/recycle-bin" icon={Trash2} label="Recycle Bin" />
          </SidebarSection>
        </LayoutGroup>
      </nav>

      <div className="border-t border-stone-border px-4 py-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <Avatar className="bg-stone-muted/40">
            <AvatarFallback className="bg-stone-muted/40 text-xs font-medium text-warm-gray uppercase">
              {user.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-ink-black">{user.name}</span>
            <span className="block truncate text-xs text-warm-gray">Signed in</span>
          </span>
          <Button
            aria-label="Sign out"
            onClick={onSignOut}
            size="icon-sm"
            title="Sign out"
            variant="ghost"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

function SidebarSection({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <section className="mb-6 last:mb-0">
      {label ? (
        <h2 className="mb-2 px-3 text-[10px] font-medium tracking-[0.14em] text-warm-gray uppercase">
          {label}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

function SidebarItem({
  href,
  icon: Icon,
  label,
  nested = false,
}: {
  href?:
    | "/contacts"
    | "/document-classes"
    | "/document-views"
    | "/documents"
    | "/discussions"
    | "/notifications"
    | "/recycle-bin"
    | "/settings"
    | "/tasks"
    | "/workflows";
  icon: LucideIcon;
  label: string;
  nested?: boolean;
}) {
  const content = (
    <>
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </>
  );

  if (href) {
    return (
      <SidebarHoverItem>
        <Button
          className={`w-full justify-start rounded-md bg-transparent px-3 hover:bg-transparent hover:text-ink-black ${nested ? "pl-6 text-warm-gray" : "text-warm-gray"}`}
          nativeButton={false}
          render={<Link to={href} />}
          size="default"
          variant="ghost"
        >
          {content}
        </Button>
      </SidebarHoverItem>
    );
  }

  return (
    <SidebarHoverItem>
      <Button
        className={`w-full justify-start rounded-md bg-transparent px-3 hover:bg-transparent hover:text-ink-black ${nested ? "pl-6 text-warm-gray" : "text-warm-gray"}`}
        size="default"
        type="button"
        variant="ghost"
      >
        {content}
      </Button>
    </SidebarHoverItem>
  );
}
