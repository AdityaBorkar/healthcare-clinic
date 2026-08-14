import { CircleAlert } from "lucide-react";
import { useCallback } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ErrorPage() {
  const reload = useCallback(() => window.location.reload(), []);

  return (
    <div className="space-y-6">
      <PageHeader description="Something went wrong." title="Error" />
      <Card className="shadow-subtle">
        <CardHeader className="items-center pt-10 pb-2 text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <CircleAlert className="size-6 text-destructive" />
          </span>
          <CardTitle className="text-lg">Something went wrong</CardTitle>
          <CardDescription className="max-w-sm text-sm">
            An unexpected error occurred while loading this page. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-10">
          <Button onClick={reload} type="button">
            Reload page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
