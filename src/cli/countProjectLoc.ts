import { parse } from "ts-command-line-args";
import { countProjectLoc } from "../handlers/countProjectLoc";
import { AnalyseProjectArgs } from "../handlers/analyseProjectArgs";

export const args = parse<AnalyseProjectArgs>({
    owner: { type: String, alias: "o", optional: true },
    repo: { type: String, alias: "r", optional: true },
    exclude: { type: String, alias: "x", optional: true, lazyMultiple: true },
});

(async () => countProjectLoc(args))();
