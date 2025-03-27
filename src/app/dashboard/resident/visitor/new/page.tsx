import { VisitorForm } from "@/components/visitor-form"

export default function NewVisitorPage() {
  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Visitor Registration</h1>
          <p className="text-muted-foreground mt-2">Enter the visitor details to register a new visit</p>
        </div>
        <VisitorForm />
      </div>
    </div>
  )
}

