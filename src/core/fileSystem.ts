import { sync } from "glob";

export const sanitiseFileName: (input: string) => string = (input: string) =>
    input.replace(".", "-").toLowerCase();

export const correctDirectoryCasing = (guessedPath: string) =>
    sync(guessedPath, { nocase: true })[0];
