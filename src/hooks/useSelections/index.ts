import { useMemo, useState } from "react";
import type { Key } from "react";
import useMemoizedFn from "../useMemoizedFn";
import { isPlainObject } from "lodash";
import { isFunction, isString } from "@/utils";

export interface Options<T> {
  defaultSelected?: T[];
  itemKey?: string | ((item: T) => Key);
}

const useSelections = <T>(items: T[], options?: T[] | Options<T>) => {
  let defaultSelected: T[] = [];
  let itemKey: Options<T>["itemKey"];

  if (Array.isArray(options)) {
    defaultSelected = options;
  } else if (isPlainObject(options)) {
    defaultSelected = options?.defaultSelected ?? defaultSelected;
    itemKey = options?.itemKey ?? itemKey;
  }

  const getKey = (item: T): Key => {
    if (isFunction(itemKey)) {
      return itemKey(item);
    }
    if (isString(itemKey) && isPlainObject(item)) {
      return item[itemKey];
    }

    return item as Key;
  };

  const [selected, setSelected] = useState<T[]>(defaultSelected);

  const selectedMap = useMemo(() => {
    const keyToItemMap = new Map();

    if (!Array.isArray(selected)) {
      return keyToItemMap;
    }

    selected.forEach((item) => {
      keyToItemMap.set(getKey(item), item);
    });

    return keyToItemMap;
  }, [selected]);

  // 是否被选择
  const isSelected = (item: T) => selectedMap.has(getKey(item));

  // 选择单个元素
  const select = (item: T) => {
    selectedMap.set(getKey(item), item);
    setSelected(Array.from(selectedMap.values()));
  };

  // 取消选择单个元素
  const unSelect = (item: T) => {
    selectedMap.delete(getKey(item));
    setSelected(Array.from(selectedMap.values()));
  };

  // 反选单个元素
  const toggle = (item: T) => {
    if (isSelected(item)) {
      unSelect(item);
    } else {
      select(item);
    }
  };

  // 选择全部元素
  const selectAll = () => {
    items.forEach((item) => {
      selectedMap.set(getKey(item), item);
    });
    setSelected(Array.from(selectedMap.values()));
  };

  // 取消选择全部元素
  const unSelectAll = () => {
    items.forEach((item) => {
      selectedMap.delete(getKey(item));
    });
    setSelected(Array.from(selectedMap.values()));
  };

  // 是否一个都没有选择
  const noneSelected = useMemo(
    () => items.every((item) => !selectedMap.has(getKey(item))),
    [items, selectedMap]
  );

  // 是否全选
  const allSelected = useMemo(
    () => items.every((item) => selectedMap.has(getKey(item))) && !noneSelected,
    [items, selectedMap, noneSelected]
  );

  // 是否半选
  const partiallySelected = useMemo(
    () => !noneSelected && !allSelected,
    [noneSelected, allSelected]
  );

  // 反选全部元素
  const toggleAll = () => (allSelected ? unSelectAll() : selectAll());

  // 清除所有选中元素
  const clearAll = () => {
    selectedMap.clear();
    setSelected([]);
  };

  return {
    selected,
    noneSelected,
    allSelected,
    partiallySelected,
    setSelected,
    isSelected,
    select: useMemoizedFn(select),
    unSelect: useMemoizedFn(unSelect),
    toggle: useMemoizedFn(toggle),
    selectAll: useMemoizedFn(selectAll),
    unSelectAll: useMemoizedFn(unSelectAll),
    clearAll: useMemoizedFn(clearAll),
    toggleAll: useMemoizedFn(toggleAll),
  } as const;
};

export default useSelections;
