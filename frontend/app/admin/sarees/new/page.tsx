import { SareeForm } from "@/features/admin/components/SareeForm.client";

export default function NewSareePage() {
  return (
    <div>
      <h1 className="text-chapter text-ink">Add New Saree</h1>
      <p className="mt-1 text-text-muted">
        Fill in details and pick saree model images — it goes live on the store instantly.
      </p>
      <div className="mt-8">
        <SareeForm />
      </div>
    </div>
  );
}
