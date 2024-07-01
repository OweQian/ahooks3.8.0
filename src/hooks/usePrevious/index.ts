import { useRef } from "react";

export type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean;

const defaultShouldUpdate = <T>(a?: T, b?: T) => !Object.is(a, b);

const usePrevious = <T>(
  state: T,
  shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate
): T | undefined => {
  /**
   * 维护两个值 prevRef.current 和 curRef.current
   * prevRef.current: 上一次的状态值
   * curRef.current: 当前的状态值
   * */
  const prevRef = useRef<T>();
  const curRef = useRef<T>();

  /**
   * 使用 shouldUpdate 判断 state 是否发生变化
   * */
  if (shouldUpdate(curRef.current, state)) {
    // 手动更新 prevRef.current 的值为上一个状态值
    prevRef.current = curRef.current;
    // 手动更新 curRef.current 的值为最新的状态值
    curRef.current = state;
  }

  // 返回上一次的状态值
  return prevRef.current;
};

export default usePrevious;
