import { parse } from "ts-command-line-args";
import { AnalyseFileArgs, analyseFile } from "../handlers/analyseFile";

export const args = parse<AnalyseFileArgs>({
    owner: { type: String, alias: "o", optional: true },
    repo: { type: String, alias: "r", optional: true },
    path: { type: String, alias: "p", optional: true },
});

(async () => console.log(await analyseFile(args)))();
