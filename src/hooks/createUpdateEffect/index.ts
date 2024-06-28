import { useRef, type useEffect, type useLayoutEffect } from "react";

type EffectHookType = typeof useEffect | typeof useLayoutEffect;

export const createUpdateEffect: (hook: EffectHookType) => EffectHookType =
  (hook) => (effect, deps) => {
    // isMounted 标识符，判断组件是否已经挂载
    const isMounted = useRef(false);

    // for react-refresh
    hook(() => {
      return () => {
        isMounted.current = false;
      };
    }, []);

    hook(() => {
      // 首次挂载，isMounted 置为 true
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        // 只有 isMounted 为 true 时（更新），执行回调函数
        return effect();
      }
    }, deps);
  };
