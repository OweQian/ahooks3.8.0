import debounce from "lodash/debounce";

// 判断当前环境是 Node 还是 Web
const isNodeOrWeb = () => {
  const freeGlobal =
    typeof global === "undefined"
      ? "undefined"
      : typeof global === "object" &&
        global &&
        global.Object === Object &&
        global;
  const freeSelf =
    typeof self === "object" && self && self.Object === Object && self;
  return freeGlobal || freeSelf;
};

if (!isNodeOrWeb()) {
  global.Date = Date;
}

export { debounce };
