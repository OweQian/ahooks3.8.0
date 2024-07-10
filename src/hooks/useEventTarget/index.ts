import { useCallback, useState } from "react";
import useLatest from "../useLatest";
import { isFunction } from "lodash";

interface EventTarget<U> {
  target: {
    value: U;
  };
}

export interface Options<T, U> {
  initialValue?: T;
  transformer?: (value: U) => T;
}

const useEventTarget = <T, U = T>(options?: Options<T, U>) => {
  const { initialValue, transformer } = options || {};
  const [value, setValue] = useState(initialValue);

  const transfomerRef = useLatest(transformer);

  // 重置函数
  const reset = useCallback(() => setValue(initialValue), []);

  // 值发生变化时的回调
  const onChange = useCallback((e: EventTarget<U>) => {
    const _value = e.target.value;
    // 判断自定义回调值的转化配置项是否存在并且为函数
    if (isFunction(transfomerRef.current)) {
      return setValue(transfomerRef.current(_value));
    }
    // no transformer => U and T should be the same
    return setValue(_value as unknown as T);
  }, []);

  return [
    value,
    {
      onChange,
      reset,
    },
  ] as const;
};

export default useEventTarget;
