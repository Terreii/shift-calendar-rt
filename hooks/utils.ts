import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useReducer,
  type RefCallback,
} from "react";
// Common Hooks

export function useTitleAlert() {
  return useCallback((event: MouseEvent) => {
    const title =
      (event.target as HTMLElement)
        .closest<HTMLElement>("[title]")
        ?.title?.trim() ?? "";
    if (title.length) {
      window.alert(title);
    }
  }, []);
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
  isSwipping: boolean;
  id: number | null;
  direction: Direction;
  startX: number;
  startY: number;
  x: number;
  y: number;
};
const initialState: State = {
  isSwipping: false,
  id: null,
  direction: null,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
};
type Actions =
  | { type: "down"; id: number; x: number; y: number }
  | { type: "cancel" }
  | { type: "end" }
  | { type: "move"; x: number; y: number };

// eslint-disable-next-line no-unused-vars
export function useSwipe(callback: (direction: Direction) => void): {
  ref: RefCallback<HTMLElement>;
  isSwipping: boolean;
  direction: Direction;
  x: number;
} {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const callbackRef = useRef<() => void>();
  callbackRef.current = () => {
    if (Math.abs(state.y) > Math.abs(state.x)) return; // did move up or down
    if (Math.abs(state.x) < 10 || !state.isSwipping) return; // didn't move

    callback(state.direction as Direction);
  };

  useEffect(() => {
    if (!ref || state.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    ref.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType === "touch" && !event.isPrimary) return;
        ref.setPointerCapture(event.pointerId);
        dispatch({
          type: "down",
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
        });
      },
      { signal },
    );

    return () => {
      abortController.abort();
    };
  }, [ref, state.id]);

  useEffect(() => {
    if (!ref || !state.id) return;
    const abortController = new AbortController();
    const signal = abortController.signal;

    ref.addEventListener(
      "pointercancel",
      (event) => {
        if (event.pointerId === state.id) {
          dispatch({ type: "cancel" });
        }
      },
      { signal },
    );

    ref.addEventListener(
      "pointerup",
      (event) => {
        if (event.pointerId === state.id) {
          dispatch({ type: "end" });
          callbackRef.current?.();
        }
      },
      { signal },
    );

    ref.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerId === state.id) {
          dispatch({
            type: "move",
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
  }, [ref, state.id]);

  return {
    ref: setRef,
    isSwipping: state.isSwipping,
    direction: state.direction as Direction,
    x: state.x,
  };
}

function reducer(state: State, action: Actions) {
  switch (action.type) {
    case "down":
      return {
        ...state,
        id: action.id,
        startX: action.x,
        startY: action.y,
      };

    case "end":
    case "cancel":
      return initialState;

    case "move": {
      const x = action.x - state.startX;
      return {
        ...state,
        isSwipping: Math.abs(Math.abs(action.x) - Math.abs(state.startX)) > 10,
        direction: x < 0 ? "left" : x > 0 ? "right" : null,
        x,
        y: action.y - state.startY,
      };
    }

    default:
      return state;
  }
}
