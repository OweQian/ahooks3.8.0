import {
  useRef,
  type DependencyList,
  type EffectCallback,
  type useEffect,
  type useLayoutEffect,
} from "react";
import { type BasicTarget, getTargetElement } from "./domTarget";
import useUnmount from "@/hooks/useUnmount";
import depsAreSame from "./depsAreSame";

const createEffectWithTarget = (
  useEffectType: typeof useEffect | typeof useLayoutEffect
) => {
  /**
   *
   * @param effect
   * @param deps
   * @param target target should compare ref.current vs ref.current, dom vs dom, ()=>dom vs ()=>dom
   */
  const useEffectWithTarget = (
    effect: EffectCallback,
    deps: DependencyList,
    target: BasicTarget<any> | BasicTarget<any>[]
  ) => {
    // 是否首次挂载
    const hasInitRef = useRef(false);

    // 上一次的目标元素
    const lastElementRef = useRef<(Element | null)[]>([]);
    // 上一次的依赖项
    const lastDepsRef = useRef<DependencyList>([]);

    // 清除副作用函数
    const unLoadRef = useRef<any>();

    useEffectType(() => {
      const targets = Array.isArray(target) ? target : [target];
      const els = targets.map((item) => getTargetElement(item));

      // init run
      if (!hasInitRef.current) {
        hasInitRef.current = true;
        lastElementRef.current = els;
        lastDepsRef.current = deps;

        // 执行回调函数
        unLoadRef.current = effect();
        return;
      }

      if (
        els.length !== lastElementRef.current.length ||
        !depsAreSame(lastElementRef.current, els) ||
        !depsAreSame(lastDepsRef.current, deps)
      ) {
        // 清除副作用
        unLoadRef.current?.();

        lastElementRef.current = els;
        lastDepsRef.current = deps;
        unLoadRef.current = effect();
      }
    });

    useUnmount(() => {
      unLoadRef.current?.();
      // for react-refresh
      hasInitRef.current = false;
    });
  };

  return useEffectWithTarget;
};

export default createEffectWithTarget;
