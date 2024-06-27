import { isFunction } from "@/utils";
import isDev from "@/utils/isDev";
import { useMemo, useRef } from "react";

type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

const useMemoizedFn = <T extends noop>(fn: T) => {
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useMemoizedFn expected parameter is a function, got ${typeof fn}`
      );
    }
  }

  // 每次拿到最新的 fn，把它更新到 fnRef，保证 fnRef 能够持有最新的 fn 引用
  const fnRef = useRef<T>(fn);

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo(() => fn, [fn]);

  // 保证最后返回的函数引用是不变的
  const memoizedFn = useRef<PickFunction<T>>();
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      // 每次调用时，都能拿到最新的 args
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current as T;
};

export default useMemoizedFn;
