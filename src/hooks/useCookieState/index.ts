import Cookies from "js-cookie";
import { useState } from "react";
import { isFunction, isString } from "@/utils";
import useMemoizedFn from "../useMemoizedFn";

export type State = string | undefined;

export interface Options extends Cookies.CookieAttributes {
  defaultValue?: State | (() => State);
}

const useCookieState = (cookieKey: string, options: Options = {}) => {
  const [state, setState] = useState<State>(() => {
    // 本地已有 cookieKey 对应的 cookie 值，直接返回
    const cookieValue = Cookies.get(cookieKey);
    if (isString(cookieValue)) return cookieValue;

    // options.defaultValue 存在并且为函数
    if (isFunction(options.defaultValue)) {
      return options.defaultValue();
    }

    return options.defaultValue;
  });

  const updateState = useMemoizedFn(
    (
      newValue: State | ((prevState: State) => State),
      newOptions: Cookies.CookieAttributes = {}
    ) => {
      // newOptions 与 options 合并
      const { defaultValue, ...restOptions } = { ...options, ...newOptions };
      // 如果是函数，则取执行后返回的结果，否则直接取该值
      const value = isFunction(newValue) ? newValue(state) : newValue;

      setState(value);

      // 如果值为 undefined，则清除 cookie。否则，调用 set 方法
      if (value === undefined) {
        Cookies.remove(cookieKey);
      } else {
        Cookies.set(cookieKey, value, restOptions);
      }
    }
  );

  return [state, updateState] as const;
};

export default useCookieState;
