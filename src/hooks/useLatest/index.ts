import { useRef } from "react";

const useLatest = <T>(value: T) => {
  const ref = useRef(value);
  // 拿到最新值
  ref.current = value;
  return ref;
};

export default useLatest;
