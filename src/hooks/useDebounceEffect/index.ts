import {
  useEffect,
  type DependencyList,
  type EffectCallback,
  useState,
} from "react";
import type { DebounceOptions } from "../useDebounce/debounceOptions";
import useDebounceFn from "../useDebounceFn";
import useUpdateEffect from "../useUpdateEffect";

const useDebounceEffect = (
  effect: EffectCallback,
  deps?: DependencyList,
  options?: DebounceOptions
) => {
  // flag 标识
  const [flag, setFlag] = useState({});

  // 对 flag 设置防抖功能
  const { run } = useDebounceFn(() => {
    setFlag({});
  }, options);

  // 监听 deps，立即调用 run 更新 flag
  useEffect(() => {
    return run();
  }, deps);

  // 监听 flag，执行 effect 回调函数
  useUpdateEffect(effect, [flag]);
};

export default useDebounceEffect;
