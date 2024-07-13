import { useEffect, useRef } from "react";

type Subscription<T> = (val: T) => void;

export class EventEmitter<T> {
  // 订阅器列表
  private subscriptions = new Set<Subscription<T>>();

  // 推送事件
  emit = (val: T) => {
    for (const subscription of this.subscriptions) {
      subscription(val);
    }
  };

  // 订阅事件
  useSubscription = (callback: Subscription<T>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const callbackRef = useRef<Subscription<T>>();
    callbackRef.current = callback;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      function subscription(val: T) {
        if (callbackRef.current) {
          callbackRef.current(val);
        }
      }
      // 组件创建时自动注册订阅
      this.subscriptions.add(subscription);
      // 组件销毁时自动取消订阅
      return () => {
        this.subscriptions.delete(subscription);
      };
    }, []);
  };
}

const useEventEmitter = <T = void>() => {
  const ref = useRef<EventEmitter<T>>();
  if (!ref.current) {
    ref.current = new EventEmitter();
  }
  return ref.current;
};

export default useEventEmitter;
