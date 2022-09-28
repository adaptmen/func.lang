import { Tree } from "../../utils/tree/Tree";
import { Token } from "../lexer/Token";


export type FuncTreeItem = {
  type: "function" | "function_name" | "value" | "comma" | "open_args" | "close_args",
  token?: Token,
};

export class FuncTree extends Tree<FuncTreeItem> {

}
