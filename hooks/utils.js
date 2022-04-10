import { useState, useEffect, useCallback } from "react";
// Common Hooks

export function useTitleAlert() {
  return useCallback((event) => {
    const title = event.target.closest("[title]")?.title?.trim() ?? "";
    if (title.length) {
      window.alert(title);
    }
  }, []);
}

/**
 * Checks if the input type is supported. Defaults to false.
 * @param {string} type   Type of an Input element.
 * @returns {boolean}     Does it support that type.
 */
export function useSupportsInputType(type) {
  const [supports, setSupports] = useState(false);

  useEffect(() => {
    const parent = document.createElement("div");
    const input = document.createElement("input");
    input.type = type;
    parent.append(input);
    setSupports(parent.firstChild.type === type);
  }, [type]);

  return supports;
}
