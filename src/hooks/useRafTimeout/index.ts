import { useCallback, useEffect, useRef } from "react";
import useLatest from "../useLatest";
import { isNumber } from "@/utils";

interface Handle {
  id: number | ReturnType<typeof setTimeout>;
}

const setRafTimeout = (callback: () => void, delay: number = 0): Handle => {
  // 不支持 requestAnimationFrame API，则改用 setTimeout
  if (typeof requestAnimationFrame === typeof undefined) {
    return {
      id: setTimeout(callback, delay),
    };
  }

  let start = Date.now();
  const handle: Handle = {
    id: 0,
  };
  // 定义动画函数
  const loop = () => {
    const current = Date.now();
    // 当前时间 - 开始时间 >= delay，则执行 callback
    if (current - start >= delay) {
      callback();
    } else {
      // 请求下一帧
      handle.id = requestAnimationFrame(loop);
    }
  };
  // 启动动画
  handle.id = requestAnimationFrame(loop);
  // 返回 handle
  return handle;
};

const cancelAnimationFrameIsNotDefined = (
  t: any
): t is ReturnType<typeof setTimeout> => {
  return typeof cancelAnimationFrame === typeof undefined;
};

const clearRafTimeout = (handle: Handle) => {
  // 不支持 cancelAnimationFrame API，则通过 clearInterval 清除
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearTimeout(handle.id);
  }
  // cancelAnimationFrame API 清除
  cancelAnimationFrame(handle.id);
};

const useRafTimeout = (fn: () => void, delay: number | undefined) => {
  const fnRef = useLatest(fn);
  const timerRef = useRef<Handle>();

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearRafTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isNumber(delay) || delay < 0) {
      return;
    }

    timerRef.current = setRafTimeout(() => {
      fnRef.current();
    }, delay);

    return clear;
  }, [delay]);

  return clear;
};

export default useRafTimeout;
