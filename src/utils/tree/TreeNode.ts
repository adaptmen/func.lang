

export class TreeNode<T> {

  childes: TreeNode<T>[] = [];

  constructor(
    readonly data: T,
    readonly parent: TreeNode<T>
  ) {
  }

  addChild(child: TreeNode<T>) {
    this.childes.push(child);
  }

}
