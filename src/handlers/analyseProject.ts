import { discoverFiles } from "../core/discoverFiles";
import { computeEntropy } from "../core/entropy";
import { sanitiseFileName } from "../core/fileNames";
import { buildFileTree } from "../core/fileTree";
import { AnalyseProjectArgs } from "./analyseProjectArgs";

export const analyseProject: (
    args: AnalyseProjectArgs
) => Promise<number> = async ({ owner, repo, exclude }) => {
    const projectDirectory = sanitiseFileName(`${owner}-${repo}`);
    const path = `${process.cwd()}/analysables/${projectDirectory}/`;
    const files = discoverFiles(path, ...(exclude || []));
    console.log(`discovered ${files.length} typescript files`);

    const fileTree = buildFileTree(path, files);

    const analysers = fileTree.getFileAnalysers();

    const batchSize = 50;
    for (var i = 0; i < batchSize; i += batchSize) {
        console.log(`Analysing files ${i} to ${i + batchSize}`);
        await Promise.all(analysers.slice(i, i + batchSize).map((x) => x()));
    }

    const treeOmega = fileTree.recomputeTreeOmega();

    const treeEntropy = computeEntropy(treeOmega);

    console.log(`project entropy calculated: ${treeEntropy}`);
    return treeEntropy;
};
