import { SecurityDashboard } from "@/components/security-dashboard";

export default function SecurityDashboardPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Security Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage visitor entry and exit for the property
          </p>
        </div>
        <SecurityDashboard />
      </div>
    </div>
  );
}
