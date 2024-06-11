import { discoverFiles } from "../core/discoverFiles";
import { correctDirectoryGuess, sanitiseFileName } from "../core/fileSystem";
import { readFileSync, statSync } from "fs";
import { AnalyseProjectArgs } from "./analyseProjectArgs";
import { sync } from "glob";

export interface CountProjectLocResults {
    linesOfCode: number;
    filesCount: number;
}

export const countProjectLoc: (
    args: AnalyseProjectArgs
) => Promise<CountProjectLocResults> = async ({
    owner,
    repo,
    exclude,
    ref,
}) => {
        console.log(`Counting lines of code for ${owner}/${repo}`);
        const projectKey = sanitiseFileName(`${owner}-${repo}`);
        const analysableKey = sanitiseFileName(`${projectKey}-${ref}`);
        const guessedPath = `${process.cwd()}/analysables/${projectKey}/${analysableKey}`;
        const path = correctDirectoryGuess(guessedPath);
        const files = discoverFiles(path, ...(exclude || []));

        var count = 0;
        var total = 0;
        for (var file of files) {
            total += countLoc(file);
            count++;
        }

        console.log(`counted ${total} lines of code across ${count} files.`);
        return { filesCount: count, linesOfCode: total };
    };

export function countLoc(file: string): number {
    if (!statSync(file).isFile()) {
        return 0;
    }

    let content = readFileSync(file).toString("utf-8");
    return content.split("\n").length;
}
