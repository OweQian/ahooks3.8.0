import { useMemo } from "react";
import useToggle from "../useToggle";

export interface Actions {
  setTrue: () => void;
  setFalse: () => void;
  set: (value: boolean) => void;
  toggle: () => void;
}

const useBoolean = (defaultValue = false): [boolean, Actions] => {
  // 基于 useToggle
  const [state, { toggle, set }] = useToggle(!!defaultValue);

  const actions: Actions = useMemo(() => {
    const setTrue = () => set(true);
    const setFalse = () => set(false);
    return {
      // 切换
      toggle,
      // 修改
      set: (v) => set(!!v),
      // 设置为 true
      setTrue,
      // 设置为 false
      setFalse,
    };
  }, []);

  return [state, actions];
};

export default useBoolean;
