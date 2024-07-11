/**
 * intersection-observer polyfill 处理
 * */
import "intersection-observer";
import { getTargetElement, type BasicTarget } from "@/utils/domTarget";
import { useState } from "react";
import useEffectWithTarget from "@/utils/useEffectWithTarget";

type CallbackType = (entry: IntersectionObserverEntry) => void;

export interface Options {
  rootMargin?: string;
  threshold?: number | number[];
  root?: BasicTarget<Element>;
  callback?: CallbackType;
}

const useInViewport = (
  target: BasicTarget | BasicTarget[],
  options?: Options
) => {
  const { callback, ...option } = options || {};

  const [state, setState] = useState<boolean>();
  const [ratio, setRatio] = useState<number>();

  useEffectWithTarget(
    () => {
      const targets = Array.isArray(target) ? target : [target];
      const els = targets
        .map((element) => getTargetElement(element))
        .filter(Boolean);

      if (!els.length) {
        return;
      }
      /**
       * 创建交叉观察器
       * */
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setRatio(entry.intersectionRatio);
            setState(entry.isIntersecting);
            callback?.(entry);
          }
        },
        {
          ...option,
          root: getTargetElement(options?.root),
        }
      );

      /**
       * 监控多个元素
       * */
      els.forEach((el) => observer.observe(el!));

      return () => {
        observer.disconnect();
      };
    },
    [callback, options?.rootMargin, options?.threshold],
    target
  );
  return [state, ratio] as const;
};

export default useInViewport;
