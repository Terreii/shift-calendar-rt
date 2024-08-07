import { type RefCallback } from "preact";
import { useState, useEffect, useRef, useReducer } from "preact/hooks";
// Common Hooks

let isFirstRender = true;

/**
 * Is this on the client.
 * Because of hydration it always starts as false. On the next render it will have the true value.
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(!isFirstRender);
  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
      setIsClient(true);
    }
  }, []);
  return isClient;
}

/**
 * Checks if the input type is supported. Defaults to false.
 * @param type   Type of an Input element.
 * @returns      Does it support that type.
 */
export function useSupportsInputType(type: HTMLInputElement["type"]): boolean {
  const [supports, setSupports] = useState(false);

  useEffect(() => {
    const parent = document.createElement("div");
    const input = document.createElement("input");
    input.type = type;
    parent.append(input);
    setSupports((parent.firstChild as HTMLInputElement).type === type);
  }, [type]);

  return supports;
}

type Direction = "left" | "right" | null;
type State = {
  isSwiping: boolean;
  id: number | null;
  direction: Direction;
  startX: number;
  startY: number;
  x: number;
  y: number;
};
const initialState: State = {
  isSwiping: false,
  id: null,
  direction: null,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
};
type Actions =
  | { type: "down"; id: number; x: number; y: number }
  | { type: "cancel"; id: number }
  | { type: "end"; id: number }
  | { type: "move"; id: number; x: number; y: number };

// eslint-disable-next-line no-unused-vars
export function useSwipe(callback: (direction: Direction) => void): {
  ref: RefCallback<HTMLElement>;
  isSwiping: boolean;
  direction: Direction;
  x: number;
} {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const callbackRef = useRef<() => void>();
  callbackRef.current = () => {
    if (Math.abs(state.y) > Math.abs(state.x)) return; // did move up or down
    if (Math.abs(state.x) < 10 || !state.isSwiping) return; // didn't move

    callback(state.direction as Direction);
  };

  useEffect(() => {
    if (!ref) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    ref.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType === "touch" && event.isPrimary) {
          try {
            ref.setPointerCapture(event.pointerId);
          } catch (error) {
            // Only needed for testing
            console.error(error);
          }
          dispatch({
            type: "down",
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          });
        }
      },
      { signal },
    );

    ref.addEventListener(
      "pointercancel",
      (event) => {
        if (event.pointerType === "touch" && event.isPrimary) {
          dispatch({ type: "cancel", id: event.pointerId });
        }
      },
      { signal },
    );

    ref.addEventListener(
      "pointerup",
      (event) => {
        if (event.pointerType === "touch" && event.isPrimary) {
          dispatch({ type: "end", id: event.pointerId });
          callbackRef.current?.();
        }
      },
      { signal },
    );

    ref.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType === "touch" && event.isPrimary) {
          dispatch({
            type: "move",
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          });
        }
      },
      { signal },
    );

    return () => {
      abortController.abort();
    };
  }, [ref]);

  return {
    ref: setRef,
    isSwiping: state.isSwiping,
    direction: state.direction as Direction,
    x: state.x,
  };
}

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case "down":
      return {
        ...state,
        id: action.id,
        startX: action.x,
        startY: action.y,
      };

    case "end":
      return !state.isSwiping && state.id && state.id === action.id
        ? initialState
        : state;

    case "cancel":
      return state.id && state.id === action.id ? initialState : state;

    case "move": {
      if (state.id == null || state.id !== action.id) return state;
      const x = action.x - state.startX;
      return {
        ...state,
        isSwiping: Math.abs(action.x - state.startX) > 10,
        direction: x < 0 ? "left" : x > 0 ? "right" : null,
        x,
        y: action.y - state.startY,
      };
    }

    default:
      return state;
  }
}
