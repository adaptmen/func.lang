import { Tree } from "./Tree";
import { TreeNode } from "./TreeNode";


export class TreeWalker<T> {

  private visitedMap = new Map<TreeNode<T>, boolean>();

  constructor(private tree: Tree<T>) {
    tree.goToRoot();
    this.visit(tree.current);
  }

  next(): TreeNode<T> {
    if (!!this.tree.current.childes.length) {
      this.tree.down();
      this.tree.left(true);
      this.visit();
      return this.tree.current;
    } else {
      if (this.tree.canRight) {
        this.tree.right();
        this.visit();
        return this.tree.current;
      } else {
        this.tree.top();
      }
    }
  }

  private visit(node: TreeNode<T> = this.tree.current) {
    this.visitedMap.set(node, true);
  }

}
