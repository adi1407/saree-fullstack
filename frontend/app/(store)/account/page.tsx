"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { ApiResponse, Address } from "@/lib/types";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");

  function load() {
    return apiClient
      .get<ApiResponse<{ name: string; email: string; phone: string; addresses: Address[] }>>("/api/auth/me")
      .then((res) => {
        setUser({ name: res.data.name, email: res.data.email, phone: res.data.phone });
        setAddresses(res.data.addresses || []);
        setForm((f) => ({ ...f, name: res.data.name, phone: res.data.phone }));
      });
  }

  useEffect(() => {
    load()
      .catch(() => router.push("/login?next=/account"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await apiClient.post<ApiResponse<Address[]>>("/api/auth/addresses", {
        ...form,
        isDefault: addresses.length === 0,
      });
      setAddresses(res.data);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await apiClient.delete<ApiResponse<Address[]>>(`/api/auth/addresses/${id}`);
      setAddresses(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  async function logout() {
    await apiClient.post("/api/auth/logout");
    router.push("/");
  }

  if (loading) {
    return <Container className="py-20 text-center text-text-muted">Loading...</Container>;
  }

  return (
    <Container className="py-10 md:py-16">
      <h1 className="text-chapter text-ink">My Account</h1>

      {user && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="border border-border bg-surface p-6">
            <h2 className="text-title">Profile</h2>
            <dl className="mt-4 space-y-2 text-small">
              <div>
                <dt className="text-text-muted">Name</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Phone</dt>
                <dd>{user.phone}</dd>
              </div>
            </dl>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => router.push("/orders")}>
                View Orders
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>

          <div className="border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-title">Saved Addresses</h2>
              <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Add Address"}
              </Button>
            </div>
            {error && <p className="mt-2 text-small text-error">{error}</p>}

            {showForm && (
              <form onSubmit={handleAddAddress} className="mt-4 space-y-3 border-t border-border pt-4">
                <Input
                  id="label"
                  label="Label"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
                <Input
                  id="addr-name"
                  label="Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  id="addr-phone"
                  label="Phone"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Input
                  id="addr-line1"
                  label="Address"
                  required
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    id="addr-city"
                    label="City"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  <Input
                    id="addr-pincode"
                    label="Pincode"
                    required
                    pattern="\d{6}"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="addr-state" className="mb-1 block text-small text-text-muted">State</label>
                  <select
                    id="addr-state"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full border border-border bg-background px-3 py-2 text-small"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" size="sm">Save Address</Button>
              </form>
            )}

            <ul className="mt-4 space-y-3">
              {addresses.length === 0 && !showForm && (
                <p className="text-small text-text-muted">No saved addresses yet.</p>
              )}
              {addresses.map((addr) => (
                <li key={addr._id} className="flex justify-between rounded border border-border p-3 text-small">
                  <div>
                    <p className="font-medium">
                      {addr.label}
                      {addr.isDefault && (
                        <span className="ml-2 text-small text-secondary">Default</span>
                      )}
                    </p>
                    <p className="text-text-muted">{addr.line1}, {addr.city} — {addr.pincode}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr._id)}
                    className="text-text-muted hover:text-error"
                    aria-label="Delete address"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Container>
  );
}
