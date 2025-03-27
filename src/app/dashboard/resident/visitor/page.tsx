import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VisitorsList } from "@/components/visitors-list";

export default function ResidentDashboardPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Visitor Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all your visitors in one place
            </p>
          </div>
          <Button asChild>
            <Link href="visitor/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Visitor
            </Link>
          </Button>
        </div>

        <VisitorsList />
      </div>
    </div>
  );
}
