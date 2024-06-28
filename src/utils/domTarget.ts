import type { MutableRefObject } from "react";
import isBrowser from "./isBrowser";
import { isFunction } from ".";

type TargetValue<T> = T | undefined | null;

/**
 * Window: 表示浏览器窗口的接口
 * Document: 表示文档的接口
 * HTMLElement 表示 HTML 元素的接口
 * Element: 表示 DOM 元素的接口
 */

type TargetType = Window | Document | HTMLElement | Element;

export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>;

export const getTargetElement = <T extends TargetType>(
  target: BasicTarget<T>,
  defaultElement?: T
) => {
  if (!isBrowser) {
    return undefined;
  }
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetValue<T>;

  if (isFunction(target)) {
    targetElement = target();
  } else if ("current" in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
};
