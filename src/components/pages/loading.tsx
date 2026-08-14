import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function LoadingPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="shadow-subtle">
        <CardContent className="flex items-center gap-3 px-8 py-6">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-ink-black">Loading…</span>
        </CardContent>
      </Card>
    </div>
  );
}
