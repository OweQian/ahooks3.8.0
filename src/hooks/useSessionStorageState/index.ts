import isBrowser from "@/utils/isBrowser";
import { createUseStorageState } from "../createUseStorageState";

const useSessionStorageState = createUseStorageState(() =>
  isBrowser ? sessionStorage : undefined
);

export default useSessionStorageState;
