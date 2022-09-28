import { FuncTree, FuncTreeItem } from "../analyze/syntax/FuncTree";
import { Stack } from "../utils/stack/Stack";
import { TreeNode } from "../utils/tree/TreeNode";


type FunctionResult = {
  type: "value" | "wait",
  value: any
};

export class Executor {

  private stack = new Stack();

  private fnResultsMap = new Map<TreeNode<FuncTreeItem>, FunctionResult>();

  execute(ast: FuncTree) {
    ast.goToRoot();
    ast.down();
    if (ast.current.data.type === "function") {

    }
  }

}
