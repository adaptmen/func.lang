

export class FunctionObj {

  readonly name: string;

  readonly function: (...args) => any;

  constructor(name: string, fn: (...args) => any) {
    this.name = name;
    this.function = fn;
  }

  exec(...args) {
    return this.function(...args);
  }

}
