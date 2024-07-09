import { getTargetElement, type BasicTarget } from "@/utils/domTarget";
import useLatest from "../useLatest";
import useEffectWithTarget from "@/utils/useEffectWithTarget";
import getDocumentOrShadow from "@/utils/getDocumentOrShadow";

type DocumentEventKey = keyof DocumentEventMap;

const useClickAway = <T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName: DocumentEventKey | DocumentEventKey[] = "click"
) => {
  const onClickAwayRef = useLatest(onClickAway);

  useEffectWithTarget(
    () => {
      const handler = (event: any) => {
        const targets = Array.isArray(target) ? target : [target];

        if (
          targets.some((item) => {
            const targetElement = getTargetElement(item);
            // 判断点击的 DOM Target 是否在定义的 DOM 元素（列表）中
            return !targetElement || targetElement.contains(event.Target);
          })
        ) {
          return;
        }
        // 触发点击事件
        onClickAwayRef.current(event);
      };

      // 事件代理 - 代理到 shadow root 或 document
      const documentOrShadow = getDocumentOrShadow(target);

      // 事件列表
      const eventNames = Array.isArray(eventName) ? eventName : [eventName];

      // 事件监听
      eventNames.forEach((event) =>
        documentOrShadow.addEventListener(event, handler)
      );

      return () => {
        // 清除事件监听
        eventNames.forEach((event) =>
          documentOrShadow.removeEventListener(event, handler)
        );
      };
    },
    Array.isArray(eventName) ? eventName : [eventName],
    target
  );
};

export default useClickAway;
