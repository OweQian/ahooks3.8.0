import { useCallback, useRef } from "react";

const useLockFn = <P extends any[] = any[], V = any>(
  fn: (...args: P) => Promise<V>
) => {
  // 竞态锁
  const lockRef = useRef(false);

  return useCallback(
    async (...args: P) => {
      // 请求正在进行，直接返回
      if (lockRef.current) return;
      // 上锁
      lockRef.current = true;
      try {
        // 执行异步请求
        const ret = await fn(...args);
        // 返回结果
        return ret;
      } catch (e) {
        // 抛出异常
        throw e;
      } finally {
        // 竞态锁重置为 false
        lockRef.current = false;
      }
    },
    [fn]
  );
};

export default useLockFn;
