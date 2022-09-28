import { BaseError } from "../base/base-error";
import { Token } from "../../analyze/lexer/Token";
import { TokenClassification } from "../../analyze/lexer/TokenClassification";


export class SequenceError extends BaseError {

  constructor(current: Token, next: Token, available: TokenClassification[]) {
    const message = `Syntax wrong: after "${current.value}" maybe [${available.join(", ")}]. But got: "${next.value}"`;
    super(message);
  }

}
