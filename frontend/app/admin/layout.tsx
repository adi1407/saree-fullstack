import { AdminGuard } from "@/features/admin/components/AdminGuard.client";
import { AdminSidebar, AdminMobileHeader } from "@/features/admin/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen min-w-0 flex-col bg-background md:flex-row">
        <AdminMobileHeader />
        <AdminSidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-10">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
