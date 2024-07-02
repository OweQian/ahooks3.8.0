import depsAreSame from "@/utils/depsAreSame";
import { useRef, type DependencyList } from "react";
const useCreation = <T>(factory: () => T, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });

  // 未初始化或新旧依赖项不相等
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    // 执行工厂函数
    current.obj = factory();
    current.initialized = true;
  }

  return current.obj as T;
};

export default useCreation;
