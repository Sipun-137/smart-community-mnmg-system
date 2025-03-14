import VisitorCard from "@/components/ui/VisitorCard";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <VisitorCard vid={id} />
    </main>
  );
}
