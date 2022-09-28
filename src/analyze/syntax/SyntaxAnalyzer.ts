import { Token } from "../lexer/Token";
import { TokenClassification } from "../lexer/TokenClassification";
import { IProductTree } from "./ProductTree";
import { StringProducts } from "./product-trees/string-products";
import { NumberProducts } from "./product-trees/number-products";
import { FuncCloseArgsProducts } from "./product-trees/func-close-args";
import { FuncOpenArgsProducts } from "./product-trees/func-open-args";
import { FuncNameProducts } from "./product-trees/func-name";
import { CommaProducts } from "./product-trees/comma-products";
import { SequenceError } from "../../errors/syntax/SequenceError";
import { FuncTree, FuncTreeItem } from "./FuncTree";
import { last } from "../../utils/array/last";
import { TreeNode } from "../../utils/tree/TreeNode";
import { FuncStore } from "../../internal/func-store/FuncStore";


export class SyntaxAnalyzer {

  private static productsTrees = new Map<TokenClassification, IProductTree>([
    ["STRING", StringProducts],
    ["NUMBER", NumberProducts],
    ["FUNC_CLOSE_ARGS", FuncCloseArgsProducts],
    ["FUNC_OPEN_ARGS", FuncOpenArgsProducts],
    ["FUNC_NAME", FuncNameProducts],
    ["COMMA", CommaProducts],
  ]);

  analyze(tokens: Token[]): FuncTree {
    const payloadTokens = tokens.filter(t => {
      return t.classification !== "SPACE"
        && t.classification !== "NEW_LINE";
    });
    SyntaxAnalyzer.checkSingleSequence(payloadTokens);
    const tree = SyntaxAnalyzer.createTree(payloadTokens);
    SyntaxAnalyzer.checkDeepSequence(tree);
    return tree;
  }

  private static checkSingleSequence(tokens: Token[]) {
    for (let i = 0; i < tokens.length; i++) {
      const isLast = i === tokens.length - 1;
      if (!isLast) {
        const current = tokens[i];
        const next = tokens[i + 1];
        const {available} = SyntaxAnalyzer.productsTrees.get(current.classification);
        const rightClassification = available.includes(next.classification as Exclude<TokenClassification, "SPACE" | "NEW_LINE">);
        if (!rightClassification) {
          throw new SequenceError(current, next, available);
        }
      }
    }
  }

  private static checkDeepSequence(tree: FuncTree) {
    SyntaxAnalyzer.checkTree(tree);
  }

  private static checkTree(tree: FuncTree) {
    tree.goToRoot();
    function checkRoot(node: TreeNode<FuncTreeItem>) {
      if (node.childes.length > 1) {
        throw new Error("Only one function call from root allowed");
      }
      if (node.childes[0].data.type === "function") {
        tree.down();
        checkNode(tree.current);
      }
    }
    function checkNode(node: TreeNode<FuncTreeItem>) {
      if (!node.parent) {
        checkRoot(node);
      } else {
        if (node.data.type === "function") {
          if (node.childes[0].data.type !== "function_name") {
            throw new Error("Function must start with function name");
          }
          if (node.childes[1].data.type !== "open_args") {
            throw new Error("After function name must place '('");
          }
          if (node.childes[node.childes.length - 1].data.type !== "close_args") {
            throw new Error("After function arguments, you must put ')'");
          }
          const functionName = node.childes[0].data.token.value;
          if (!FuncStore.has(functionName)) {
            throw new Error(`Function with name "${functionName}" is not defined`);
          }
          const argumentsWithCommas = node.childes.slice(2, -1);
          argumentsWithCommas.forEach((arg, index) => {
            if (index % 2) {
              if (arg.data.type !== "comma") {
                throw new Error("After each argument must place comma");
              }
            } else {
              if (arg.data.type === "comma") {
                throw new Error("Arguments must be separated by a comma");
              }
            }
          });
          const functions = argumentsWithCommas.filter(arg => arg.data.type === "function");
          functions.forEach(fn => checkNode(fn));
        }
      }
    }
    checkNode(tree.current);
  }

  private static createTree(tokens: Token[]): FuncTree {
    const tree = new FuncTree();
    tokens.forEach(token => {
      switch (token.classification) {
        case "COMMA": {
          tree.addNode({type: "comma", token});
          break;
        }
        case "STRING":
        case "NUMBER": {
          tree.addNode({type: "value", token});
          break;
        }
        case "FUNC_NAME": {
          tree.addNode({type: "function"});
          tree.down();
          tree.addNode({type: "function_name", token});
          break;
        }
        case "FUNC_OPEN_ARGS": {
          tree.addNode({type: "open_args", token});
          break;
        }
        case "FUNC_CLOSE_ARGS": {
          if (tree.current.data.type === "function") {
            if (last(tree.current?.childes)?.data?.type === "close_args") {
              tree.top();
            }
            tree.addNode({type: "close_args", token});
          }
          break;
        }
      }
    });
    return tree;
  }

}
