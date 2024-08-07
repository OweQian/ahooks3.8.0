import { useRef, type DependencyList, useEffect } from "react";

type Effect<T extends DependencyList> = (
  changes?: number[],
  previousDeps?: T,
  currentDeps?: T
) => void | (() => void);

const diffTwoDeps = (deps1?: DependencyList, deps2?: DependencyList) => {
  // Let's do a reference equality check on 2 dependency list.
  // If deps1 is defined, we iterate over deps1 and do comparison on each element with equivalent element from deps2
  // As this func is used only in this hook, we assume 2 deps always have same length.
  return deps1
    ? deps1
        .map((_ele, idx) => (!Object.is(deps1[idx], deps2?.[idx]) ? idx : -1))
        .filter((ele) => ele >= 0)
    : deps2
      ? deps2.map((_ele, idx) => idx)
      : [];
};
const useTrackedEffect = <T extends DependencyList>(
  effect: Effect<T>,
  deps?: [...T]
) => {
  // 上一次的依赖
  const previousDepsRef = useRef<T>();

  useEffect(() => {
    // 变化的依赖 index 数组
    const changes = diffTwoDeps(previousDepsRef.current, deps);
    const previousDeps = previousDepsRef.current;
    previousDepsRef.current = deps;
    return effect(changes, previousDeps, deps);
  }, deps);
};

export default useTrackedEffect;
