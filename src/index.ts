import { Program } from "./program/Program";


const code = `
log("Text for log", log(123.23))
`;

const program = new Program(code);

program.execute();
