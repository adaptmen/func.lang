import { TreeNode } from "./TreeNode";


export class Tree<T> {

  private root: TreeNode<T>;

  private pointer: TreeNode<T>;

  constructor() {
    this.root = new TreeNode<T>("root" as any, null);
    this.pointer = this.root;
  }

  addNode(data: T) {
    const item = new TreeNode(data, this.pointer);
    this.pointer.addChild(item);
  }

  get current(): TreeNode<T> {
    return this.pointer;
  }

  get brothers(): TreeNode<T>[] {
    return this.pointer.parent ? this.pointer.parent.childes : [];
  }

  goToRoot() {
    this.pointer = this.root;
  }

  top(): boolean {
    if (this.pointer.parent) {
      this.pointer = this.pointer.parent;
    }
    return !!this.pointer.parent;
  }

  down(): boolean {
    if (!!this.pointer.childes.length) {
      this.pointer = this.pointer.childes[this.pointer.childes.length - 1];
    }
    return this.pointer.childes.length > 0;
  }

  left(far: boolean = false): boolean {
    if (this.brothers.length === 1) {
      return false;
    }
    const childIndex = this.brothers.findIndex(c => c === this.pointer);
    if (childIndex >= 1) {
      this.pointer = this.brothers[far ? 0 : childIndex - 1];
    } else {
      return false;
    }

    return this.brothers.findIndex(c => c === this.pointer) >= 1;
  }

  right(far: boolean = false): boolean {
    if (this.brothers.length === 1) {
      return false;
    }
    const childIndex = this.brothers.findIndex(c => c === this.pointer);
    if (childIndex <= this.brothers.length - 2) {
      this.pointer = this.brothers[far ? this.brothers.length - 1 : childIndex + 1];
    } else {
      return false;
    }

    return this.brothers.findIndex(c => c === this.pointer) <= this.brothers.length - 2;
  }

  get canRight(): boolean {
    return this.brothers.findIndex(c => c === this.pointer) === this.brothers.length - 1;
  }

}
