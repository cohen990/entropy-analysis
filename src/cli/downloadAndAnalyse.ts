import { parse } from "ts-command-line-args";
import { AnalyseProjectArgs } from "../handlers/analyseProjectArgs";
import { DownloadArgs, download } from "../handlers/download";
import { analyseProject } from "../handlers/analyseProject";
import { countProjectLoc } from "../handlers/countProjectLoc";
import { writeResults } from "../handlers/writeResults";

export const args = parse<AnalyseProjectArgs & DownloadArgs>({
    owner: { type: String, alias: "o", optional: true },
    repo: { type: String, alias: "r", optional: true },
    ref: { type: String, alias: "f", optional: true },
    exclude: { type: String, alias: "x", optional: true, lazyMultiple: true },
});

(async () => {
    const size = await download(args);
    const loc = await countProjectLoc(args);
    const entropy = await analyseProject(args);
    await writeResults({ ...args, size, loc, entropy });
})();
