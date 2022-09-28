import { FunctionObj } from "./FunctionObj";


export class FuncStoreClass {

  private functions: Map<FunctionObj["name"], FunctionObj> = new Map();

  addFunction(funcObj: FunctionObj) {
    this.functions.set(funcObj.name, funcObj);
  }

  has(funcName: FunctionObj["name"]) {
    return this.functions.has(funcName);
  }

  get(funcName: FunctionObj["name"]): FunctionObj | null {
    return this.functions.get(funcName) || null;
  }

}

export const FuncStore = new FuncStoreClass();
