import { discoverFiles } from "../core/discoverFiles";
import { countLoc } from "../core/countLoc";
import { sanitiseFileName } from "../core/fileNames";
import { AnalyseProjectArgs } from "./analyseProjectArgs";

export const countProjectLoc: (
    args: AnalyseProjectArgs
) => Promise<number> = async ({ owner, repo, exclude }) => {
    console.log(`Counting lines of code for ${owner}/${repo}`);
    const projectDirectory = sanitiseFileName(`${owner}-${repo}`);
    const path = `${process.cwd()}/analysables/${projectDirectory}/`;
    const files = discoverFiles(path, ...(exclude || []));

    var count = 0;
    var total = 0;
    for (var file of files) {
        total += countLoc(file);
        count++;
    }

    console.log(`counted ${total} lines of code across ${count} files.`);
    return total;
};
