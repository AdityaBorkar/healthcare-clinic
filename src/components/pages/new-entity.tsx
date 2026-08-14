import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type NewEntityPageProps = {
  title: string;
  description: string;
  domain: string;
  backHref: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};

export function NewEntityPage({
  title,
  description,
  domain,
  backHref,
  icon: Icon,
  children,
}: NewEntityPageProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        actions={
          <Button nativeButton={false} render={<Link to={backHref} />} variant="outline">
            <ArrowLeft /> Back
          </Button>
        }
        description={description}
        title={title}
      />
      <Card className="shadow-[var(--shadow-md)]">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Icon className="size-5 text-warm-gray" />
            <Badge className="bg-sky-wash/40 text-cyan-edge uppercase">{domain}</Badge>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
