import "../internal/internal";
import { LexerAnalyzer } from "../analyze/lexer/LexerAnalyzer";
import { SyntaxAnalyzer } from "../analyze/syntax/SyntaxAnalyzer";
import { Executor } from "../executor/Executor";

export class Program {

  private lexer = new LexerAnalyzer();

  private syntax = new SyntaxAnalyzer();

  private executor = new Executor();

  constructor(public code: string) {
  }

  analyze() {
    const tokens = this.lexer.parse(this.code);
    return this.syntax.analyze(tokens);
  }

  execute() {
    const ast = this.analyze();
    this.executor.execute(ast);
  }

}
