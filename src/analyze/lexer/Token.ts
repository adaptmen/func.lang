import { TokenClassification } from "./TokenClassification";


export class Token {

  constructor(
    public classification: TokenClassification,
    public value: string
  ) {
  }

  addValue(char: string) {
    this.value = this.value + char;
  }

}
