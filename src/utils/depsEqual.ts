import type { DependencyList } from "react";
import isEqual from "react-fast-compare";

// deps 通过 react-fast-compare 进行深比较
export const depsEqual = (
  aDeps: DependencyList = [],
  bDeps: DependencyList = []
) => isEqual(aDeps, bDeps);
