import { UserForm } from "@/components/ui/UserForm";

export default function NewUserPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
        <p className="text-muted-foreground">Create a new user account.</p>
      </div>
      <UserForm />
    </div>
  );
}
