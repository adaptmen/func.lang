import { FuncStore } from "./func-store/FuncStore";
import { FunctionObj } from "./func-store/FunctionObj";


FuncStore.addFunction(
  new FunctionObj("log", function internalLog(...args) { console.log(...args) })
);
