import { Dispatch, SetStateAction, useRef, useState } from "react";
import useCreation from "../useCreation";
import { isFunction } from "lodash";
import useMemoizedFn from "../useMemoizedFn";
type ResetState = () => void;

const useResetState = <S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, ResetState] => {
  const initialStateRef = useRef(initialState);
  const initialStateMemo = useCreation(
    () =>
      isFunction(initialStateRef.current)
        ? initialStateRef.current()
        : initialStateRef.current,
    []
  );

  const [state, setState] = useState(initialStateMemo);
  // 暴露一个 resetState 方法重置 state 为 initialState
  const resetState = useMemoizedFn(() => {
    setState(initialStateMemo);
  });

  return [state, setState, resetState];
};

export default useResetState;
