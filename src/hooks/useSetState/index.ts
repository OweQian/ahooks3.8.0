import { isFunction } from "@/utils";
import { useCallback, useState } from "react";

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null)
) => void;

const useSetState = <S extends Record<string, any>>(
  initialState: S | (() => S)
): [S, SetState<S>] => {
  const [state, setState] = useState<S>(initialState);

  // 合并操作，返回一个全新的状态值
  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      // 判断新状态值是否为函数
      const newState = isFunction(patch) ? patch(prevState) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
};

export default useSetState;
