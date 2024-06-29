import { useEffect, useState } from "react";
import type { ThrottleOptions } from "./throttleOptions";
import useThrottleFn from "../useThrottleFn";

const useThrottle = <T>(value: T, options?: ThrottleOptions) => {
  const [throttled, setThrottled] = useState(value);

  // 依赖 useThrottleFn
  const { run } = useThrottleFn(() => {
    setThrottled(value);
  }, options);

  // 监听 value 变化，立即执行节流函数，更新 throttled 值
  useEffect(() => {
    run();
  }, [value]);

  return throttled;
};

export default useThrottle;
