import { useMemo, useState } from "react";

export interface Actions<T> {
  setLeft: () => void;
  setRight: () => void;
  set: (value: T) => void;
  toggle: () => void;
}

/**
 * 函数重载，声明入参和出参类型，根据不同的入参返回不同的结果
 * 入参可能有两个值，第一个为默认值（左值），第二个为取反之后的值（右值）
 * 不传右值时，根据默认值取反 !defaultValue
 */
function useToggle<T = boolean>(): [boolean, Actions<T>];
function useToggle<T>(defaultValue: T): [T, Actions<T>];
function useToggle<T, U>(
  defaultValue: T,
  reverseValue: U
): [T | U, Actions<T | U>];
function useToggle<D, R>(
  defaultValue: D = false as unknown as D,
  reverseValue?: R
): [D | R, Actions<D | R>] {
  const [state, setState] = useState<D | R>(defaultValue);

  const actions = useMemo(() => {
    const reverseValueOrigin = (
      reverseValue === undefined ? !defaultValue : reverseValue
    ) as D | R;

    // 切换
    const toggle = () =>
      setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));
    // 修改
    const set = (value: D | R) => setState(value);
    // 设为左值
    const setLeft = () => setState(defaultValue);
    // 设为右值
    const setRight = () => setState(reverseValueOrigin);

    return {
      toggle,
      set,
      setLeft,
      setRight,
    };
  }, []);

  return [state, actions];
}
