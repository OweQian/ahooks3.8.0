import { isFunction, isUndef } from "@/utils";
import { useState } from "react";
import useUpdateEffect from "../useUpdateEffect";
import useMemoizedFn from "../useMemoizedFn";
import useEventListener from "../useEventListener";

export const SYNC_STORAGE_EVENT_NAME = "AHOOKS_SYNC_STORAGE_EVENT_NAME";

export type SetState<S> = S | ((prevState?: S) => S);

export interface Options<T> {
  defaultValue?: T | (() => T);
  // 是否监听存储变化
  listenStorageChange?: boolean;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  onError?: (error: unknown) => void;
}

export const createUseStorageState = (
  getStorage: () => Storage | undefined
) => {
  const useStorageState = <T>(key: string, options: Options<T> = {}) => {
    let storage: Storage | undefined;
    const {
      listenStorageChange = false,
      onError = (e) => {
        console.error(e);
      },
    } = options;

    /**
     * 🐞
     * getStorage 可以返回 localStorage/sessionStorage/undefined
     * 当 cookie 被 disabled 时，访问不了 localStorage/sessionStorage
     * */
    try {
      storage = getStorage();
    } catch (err) {
      onError(err);
    }

    // 支持自定义序列化方法，默认 JSON.stringify
    const serializer = (value: T) => {
      if (options.serializer) {
        return options.serializer(value);
      }
      return JSON.stringify(value);
    };

    // 支持自定义反序列化方法，默认 JSON.parse
    const deserializer = (value: string): T => {
      if (options.deserializer) {
        return options.deserializer(value);
      }
      return JSON.parse(value);
    };

    function getStoredValue() {
      try {
        const raw = storage?.getItem(key);
        if (raw) {
          return deserializer(raw);
        }
      } catch (e) {
        onError(e);
      }
      if (isFunction(options.defaultValue)) {
        return options.defaultValue();
      }
      return options.defaultValue;
    }

    const [state, setState] = useState(getStoredValue);

    // key 更新时执行
    useUpdateEffect(() => {
      setState(getStoredValue());
    }, [key]);

    const updateState = (value?: SetState<T>) => {
      // 如果 value 为函数，则取执行后结果；否则，直接取值
      const currentState = isFunction(value) ? value(state) : value;

      // 不监听存储变化
      if (!listenStorageChange) {
        setState(currentState);
      }

      try {
        let newValue: string | null;
        const oldValue = storage?.getItem(key);

        // 如果值为 undefined，则 removeItem
        if (isUndef(currentState)) {
          newValue = null;
          storage?.removeItem(key);
        } else {
          // setItem
          newValue = serializer(currentState);
          storage?.setItem(key, newValue);
        }

        // 触发自定义事件 SYNC_STORAGE_EVENT_NAME
        dispatchEvent(
          // send custom event to communicate within same page
          // importantly this should not be a StorageEvent since those cannot
          // be constructed with a non-built-in storage area
          new CustomEvent(SYNC_STORAGE_EVENT_NAME, {
            detail: {
              key,
              newValue,
              oldValue,
              storageArea: storage,
            },
          })
        );
      } catch (e) {
        onError(e);
      }
    };

    // 处理 storage 事件
    const syncState = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== storage) {
        return;
      }

      // 更新状态
      setState(getStoredValue());
    };

    // 处理自定义事件 SYNC_STORAGE_EVENT_NAME
    const syncStateFromCustomEvent = (event: CustomEvent<StorageEvent>) => {
      syncState(event.detail);
    };

    // from another document
    useEventListener("storage", syncState, {
      enable: listenStorageChange,
    });

    // from the same document but different hooks
    useEventListener(SYNC_STORAGE_EVENT_NAME, syncStateFromCustomEvent, {
      enable: listenStorageChange,
    });

    return [state, useMemoizedFn(updateState)] as const;
  };

  return useStorageState;
};
