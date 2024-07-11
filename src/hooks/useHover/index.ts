import type { BasicTarget } from "@/utils/domTarget";
import useBoolean from "../useBoolean";
import useEventListener from "../useEventListener";

export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
  onChange?: (isHovering: boolean) => void;
}

const useHover = (target: BasicTarget, options?: Options) => {
  const { onEnter, onChange, onLeave } = options || {};

  const [state, { setTrue, setFalse }] = useBoolean(false);

  // 监听 mouseenter 事件
  useEventListener(
    "mouseenter",
    () => {
      onEnter?.();
      setTrue();
      onChange?.(true);
    },
    {
      target,
    }
  );

  // 监听 mouseleave 事件
  useEventListener(
    "mouseleave",
    () => {
      onLeave?.();
      setFalse();
      onChange?.(false);
    },
    {
      target,
    }
  );

  return state;
};

export default useHover;
