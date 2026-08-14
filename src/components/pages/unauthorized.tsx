import { ShieldX } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md text-center shadow-subtle">
        <CardHeader className="items-center pt-10 pb-2 text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-sky-wash/40">
            <ShieldX className="size-6 text-cyan-edge" />
          </span>
          <CardTitle className="text-lg">Access denied</CardTitle>
          <CardDescription className="max-w-sm text-sm">
            You don&apos;t have permission to view this resource. Contact your administrator if you
            believe this is a mistake.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10" />
      </Card>
    </div>
  );
}
