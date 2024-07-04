import { depsEqual } from "@/utils/depsEqual";
import { type DependencyList, useEffect, useLayoutEffect, useRef } from "react";

type EffectHookType = typeof useEffect | typeof useLayoutEffect;
type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;

export const createDeepCompareEffect: CreateUpdateEffect =
  (hook) => (effect, deps) => {
    // 存储上一次的依赖项
    const ref = useRef<DependencyList>();
    // 创建一个信号值
    const signalRef = useRef<number>(0);

    // 判断最新的依赖项和上一次的依赖项是否相等
    if (deps === undefined || !depsEqual(deps, ref.current)) {
      ref.current = deps;
      // 不相等则更新信号值
      signalRef.current += 1;
    }

    // 信号值更新触发回调
    hook(effect, [signalRef.current]);
  };
