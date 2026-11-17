import "server-only";

import { cookies } from "next/headers";
import { isHostedStoreTemplateDemo } from "@/lib/demo-mode";

export const demoAdminCredentials = {
  email: "demo@yourstore.local",
  password: "Demo1234!",
} as const;

const demoAdminCookie = "store_template_demo_admin";

export function isAdminDemoMode() {
  return isHostedStoreTemplateDemo()
    || (process.env.NODE_ENV !== "production"
    && process.env.STORE_TEMPLATE_DEMO_MODE === "true"
    && process.env.STORE_TEMPLATE_DEMO_ADMIN === "true");
}

export async function hasDemoAdminSession() {
  return isAdminDemoMode() && (await cookies()).get(demoAdminCookie)?.value === "1";
}

export async function startDemoAdminSession() {
  (await cookies()).set(demoAdminCookie, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
}

export async function endDemoAdminSession() {
  (await cookies()).delete(demoAdminCookie);
}
