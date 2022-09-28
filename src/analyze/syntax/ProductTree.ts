import { TokenClassification } from "../lexer/TokenClassification";


export interface IProductTree {
  classification: Exclude<TokenClassification, "SPACE" | "NEW_LINE">,
  available: Exclude<TokenClassification, "SPACE" | "NEW_LINE">[]
};
