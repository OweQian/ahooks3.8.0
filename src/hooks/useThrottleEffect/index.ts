import {
  useEffect,
  type DependencyList,
  type EffectCallback,
  useState,
} from "react";
import useUpdateEffect from "../useUpdateEffect";
import type { ThrottleOptions } from "../useThrottle/throttleOptions";
import useThrottleFn from "../useThrottleFn";

const useThrottleEffect = (
  effect: EffectCallback,
  deps?: DependencyList,
  options?: ThrottleOptions
) => {
  // flag 标识
  const [flag, setFlag] = useState({});

  // 对 flag 设置节流功能
  const { run } = useThrottleFn(() => {
    setFlag({});
  }, options);

  // 监听 deps，立即调用 run 更新 flag
  useEffect(() => {
    return run();
  }, deps);

  // 监听 flag，执行 effect 回调函数
  useUpdateEffect(effect, [flag]);
};

export default useThrottleEffect;
