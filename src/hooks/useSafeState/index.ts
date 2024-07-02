import { useCallback, type Dispatch, type SetStateAction, useState } from "react";
import useUnmountedRef from "../useUnmountedRef";

function useSafeState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];
function useSafeState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>];

function useSafeState<S>(
  initialState?: S | (() => S)
) {
  const unmountedRef = useUnmountedRef();
  const [state, setState] = useState(initialState);

  const setCurrentState = useCallback((currentState) => {
    /** if component is unmounted, stop update */
     // 如果组件已经卸载，则停止更新状态
    if (unmountedRef.current) return;
     // 更新状态
    setState(currentState);
  }, []);

  return [state, setCurrentState] as const;
}

export default useSafeState;
