import type { ViewTransitionAPI } from "@/lib/types/view-transition";

export async function runWithViewTransition(update: () => void | Promise<void>): Promise<void> {
  if (typeof document === "undefined") {
    await update();
    return;
  }

  const api = document as Document & ViewTransitionAPI;
  if (!api.startViewTransition) {
    await update();
    return;
  }

  await api.startViewTransition(update).finished;
}
