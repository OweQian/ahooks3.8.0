import { useRef, type DependencyList, type EffectCallback } from "react";
import type { BasicTarget } from "./domTarget";
import { depsEqual } from "./depsEqual";
import useEffectWithTarget from "./useEffectWithTarget";

const useDeepCompareWithTarget = (
  effect: EffectCallback,
  deps: DependencyList,
  target: BasicTarget<any> | BasicTarget<any>[]
) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (!depsEqual(deps, ref.current)) {
    signalRef.current += 1;
  }

  ref.current = deps;

  useEffectWithTarget(effect, [signalRef.current], target);
};

export default useDeepCompareWithTarget;
