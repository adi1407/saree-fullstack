"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { ApiResponse, User } from "@/lib/types";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    apiClient
      .get<ApiResponse<User>>("/api/auth/me")
      .then((res) => {
        if (res.data.role !== "admin") {
          router.replace("/login?next=/admin");
        } else {
          setReady(true);
        }
      })
      .catch(() => router.replace("/login?next=/admin"));
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-white">
        Loading admin...
      </div>
    );
  }

  return <>{children}</>;
}
