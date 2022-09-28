

export class Stack<T> {

  private elements: T[] = [];

  push(element: T): void {
    this.elements.push(element);
  }

  pop(): T {
    return this.elements.pop();
  }

  last(): T {
    return this.elements[(this.elements.length - 1) || 0];
  }

  get size(): number {
    return this.elements.length;
  }

}
