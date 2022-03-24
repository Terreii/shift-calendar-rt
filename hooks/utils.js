import { useCallback } from "react";
// Common Hooks

export function useTitleAlert() {
  return useCallback((event) => {
    const title = event.target.closest("[title]")?.title?.trim() ?? "";
    if (title.length) {
      window.alert(title);
    }
  }, []);
}
