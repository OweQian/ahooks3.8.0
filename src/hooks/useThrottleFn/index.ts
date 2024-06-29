import isDev from "@/utils/isDev";
import { isFunction } from "@/utils";
import useLatest from "../useLatest";
import { useMemo } from "react";
import useUnmount from "../useUnmount";
import type { ThrottleOptions } from "../useThrottle/throttleOptions";
import throttle from "lodash/throttle";

type noop = (...args: any[]) => any;

const useThrottleFn = <T extends noop>(fn: T, options?: ThrottleOptions) => {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useThrottleFn expected parameter is a function, got ${typeof fn}`
      );
    }
  }

  const fnRef = useLatest(fn);

  // 默认需要节流的毫秒为 1000 毫秒
  const wait = options?.wait ?? 1000;

  /**
   * 调用 lodash 的 throttle 方法
   * https://www.lodashjs.com/docs/lodash.throttle
   */
  const throttled = useMemo(
    () =>
      throttle(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args);
        },
        wait,
        options
      ),
    []
  );

  // 卸载时取消延迟的函数调用
  useUnmount(() => {
    throttled.cancel();
  });

  return {
    // 节流函数
    run: throttled,
    // 取消延迟的函数调用
    cancel: throttled.cancel,
    // 立即调用
    flush: throttled.flush,
  };
};

export default useThrottleFn;
