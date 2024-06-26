import { getTargetElement, type BasicTarget } from "@/utils/domTarget";
import useLatest from "../useLatest";
import useEffectWithTarget from "@/utils/useEffectWithTarget";

type noop = (...p: any) => void;

export type Target = BasicTarget<Window | Document | HTMLElement | Element>;

type Options<T extends Target = Target> = {
  target?: T;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  // 可选项，是否开启监听
  enable?: boolean;
};

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>
): void;
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>
): void;
function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>
): void;
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>
): void;
function useEventListener(
  eventName: string,
  handler: (ev: Event) => void,
  options?: Options<Window>
): void;
function useEventListener(
  eventName: string,
  handler: noop,
  options: Options
): void;
function useEventListener(
  eventName: string,
  handler: noop,
  options: Options = {}
) {
  // 默认开启监听
  const { enable = true } = options;

  const handlerRef = useLatest(handler);

  useEffectWithTarget(
    () => {
      // 是否开启监听
      if (!enable) {
        return;
      }

      const targetElement = getTargetElement(options.target, window);
      // 是否支持 addEventListener
      if (!targetElement?.addEventListener) {
        return;
      }

      const eventListener = (event: Event) => {
        return handlerRef.current(event);
      };
      // 为指定元素添加事件监听器
      targetElement.addEventListener(eventName, eventListener, {
        // 指定事件是否在捕获阶段进行处理
        capture: options.capture,
        // 指定事件是否只触发一次
        once: options.once,
        // 指定事件处理函数是否不会调用 preventDefault()
        passive: options.passive,
      });

      // 移除事件监听器
      return () => {
        targetElement.removeEventListener(eventName, eventListener, {
          capture: options.capture,
        });
      };
    },
    [eventName, options.capture, options.once, options.passive, enable],
    options.target
  );
}
export default useEventListener;
