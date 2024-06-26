import { parse } from "ts-command-line-args";
import { countProjectLoc } from "../handlers/countProjectLoc";
import { AnalyseProjectArgs } from "../handlers/analyseProjectArgs";

export const args = parse<AnalyseProjectArgs>({
    owner: { type: String, alias: "o", optional: true },
    repo: { type: String, alias: "r", optional: true },
    ref: { type: String, alias: "f", optional: true },
    exclude: { type: String, alias: "x", optional: true, lazyMultiple: true },
});

(async () => console.log(await countProjectLoc(args)))();
