import { parse } from "ts-command-line-args";
import { DownloadAndAnalyseProjectArgs } from "../handlers/analyseProjectArgs";
import { download } from "../handlers/download";
import { analyseProject } from "../handlers/analyseProject";
import { countProjectLoc } from "../handlers/countProjectLoc";
import { writeResults } from "../handlers/writeResults";

export const args = parse<DownloadAndAnalyseProjectArgs>({
    owner: { type: String, alias: "o", optional: true },
    repo: { type: String, alias: "r", optional: true },
    maxLoc: { type: Number, alias: "m", optional: true },
    exclude: { type: String, alias: "x", optional: true, lazyMultiple: true },
});

(async () => {
    const repoDetails = await download(args);
    const argsWithRef = { ...args, ref: repoDetails.refSha };
    const countLocResults = await countProjectLoc(argsWithRef);
    if (args.maxLoc && countLocResults.linesOfCode > args.maxLoc) {
        console.log(
            `Project has ${countLocResults.linesOfCode}. Greater than the requested max of ${args.maxLoc}. Skipping`
        );
        return;
    }
    const entropy = await analyseProject(argsWithRef);
    await writeResults({
        ...args,
        sizeInBytes: repoDetails.sizeInBytes,
        loc: countLocResults.linesOfCode,
        filesCount: countLocResults.filesCount,
        entropy,
        refSha: repoDetails.refSha,
        languages: repoDetails.allLanguages,
        openIssuesCount: repoDetails.openIssuesCount,
        primaryLanguage: repoDetails.primaryLanguage,
    });
})();
