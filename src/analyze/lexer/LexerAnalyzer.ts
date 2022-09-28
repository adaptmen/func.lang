import { Token } from "./Token";
import { last } from "../../utils/array/last";
import { isCharDigit } from "../../utils/is/isCharDigit";
import {
  COMMA_CODE, DOT_CODE, FUNC_ARGS_CLOSE_CODE, FUNC_ARGS_OPEN_CODE,
  FUNC_NAME_CHARS,
  NEW_LINE_CODE,
  NUMBER_CHARS,
  SPACE_CODE,
  STRING_QUOTE_CODE,
  TAB_CODE
} from "./codes";


type LexerMode = "code"
  | "string"
  | "number";


export class LexerAnalyzer {

  private mode: LexerMode = "code";

  private result: Token[] = [];

  private get last(): Token | null {
    return last(this.result);
  }

  parse(code: string = "") {
    this.result = [];
    this.mode = "code";
    for (let i = 0; i < code.length; i++) {
      const char = code.charAt(i);
      const charCode = code.charCodeAt(i);
      const prevCharCode = code.charCodeAt(i - 1);
      // @ts-ignore
      if (this.mode === "string") {
        this.handleString(char, charCode, prevCharCode);
      }
      // @ts-ignore
      else if (this.mode === "number") {
        this.handleNumber(char, charCode);
      }
      // @ts-ignore
      else if (this.mode === "code") {
        this.handleCode(char, charCode);
      }
    }
    return this.result;
  }

  private handleCode(
    char: string,
    charCode: number,
  ) {
    if (charCode === STRING_QUOTE_CODE) {
      this.result.push(new Token("STRING", char));
      this.mode = "string";
      return;
    }
    if (isCharDigit(char)) {
      const token = this.last;
      if (token?.classification !== "FUNC_NAME") {
        if (!token || token.classification !== "NUMBER") {
          this.result.push(new Token("NUMBER", char));
          this.mode = "number";
          return;
        }
      }
    }
    if (charCode === SPACE_CODE || charCode === TAB_CODE) {
      if (this.last?.classification === "SPACE") {
        this.last.addValue(char);
        return;
      }
      this.result.push(new Token("SPACE", char));
    }
    if (FUNC_NAME_CHARS.includes(char)) {
      const token = this.last;
      if ((!token || token.classification !== "FUNC_NAME") && !isCharDigit(char)) {
        this.result.push(new Token("FUNC_NAME", char));
        return;
      } else {
        token.addValue(char);
        return;
      }
    }
    if (charCode === FUNC_ARGS_OPEN_CODE) {
      this.result.push(new Token("FUNC_OPEN_ARGS", char));
      return;
    }
    if (charCode === FUNC_ARGS_CLOSE_CODE) {
      this.result.push(new Token("FUNC_CLOSE_ARGS", char));
      return;
    }
    if (charCode === COMMA_CODE) {
      this.result.push(new Token("COMMA", char));
      return;
    }
    if (charCode === NEW_LINE_CODE) {
      this.result.push(new Token("NEW_LINE", char));
      return;
    }
  }

  private handleString(
    char: string,
    charCode: number,
    prevCharCode: number,
  ) {
    const token = this.last;
    if (charCode !== STRING_QUOTE_CODE && prevCharCode !== 92) {
      token.addValue(char);
      return;
    }
    token.addValue(char);
    this.mode = "code";
  }

  private handleNumber(
    char: string,
    charCode: number,
  ) {
    const token = this.last;
    if (
      isCharDigit(char)
      && token.value.length > 0
      || (charCode === DOT_CODE && !token.value.includes("."))
    ) {
      token.addValue(char);
      return;
    } else {
      this.mode = "code";
      this.handleCode(char, charCode);
    }
  }

}
