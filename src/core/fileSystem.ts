import { sync } from "glob";

export const sanitiseFileName: (input: string) => string = (input: string) =>
    input.replace(".", "-").toLowerCase();

export const correctDirectoryGuess = (guessedPath: string) =>
    sync(`${guessedPath}*`, { nocase: true })[0];
