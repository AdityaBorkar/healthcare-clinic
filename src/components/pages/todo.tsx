import { Construction } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TodoPage({ title, tabs }: { title: string; tabs?: readonly string[] }) {
  return (
    <main className="bg-stone-canvas p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader title={title} />
        {tabs && tabs.length > 0 ? (
          <Tabs className="w-fit border-b border-stone-border" defaultValue={tabs[0]}>
            <TabsList variant="line">
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}
        <Card className="border-dashed bg-stone-muted/20 shadow-none">
          <CardHeader className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-sky-wash/40">
              <Construction className="size-6 text-cyan-edge" />
            </span>
            <CardTitle className="text-lg">Coming Soon</CardTitle>
            <CardDescription className="max-w-sm text-sm">
              <span className="font-medium text-ink-black">{title}</span> is not available yet. We
              are actively building this module — check back soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
