import isBrowser from "@/utils/isBrowser";
import { createUseStorageState } from "../createUseStorageState";

const useLocalStorageState = createUseStorageState(() =>
  isBrowser ? localStorage : undefined
);

export default useLocalStorageState;
