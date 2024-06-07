import { discoverFiles } from "../core/discoverFiles";
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

    const analysers = fileTree.getFileEntropyAnalysers();

    await Promise.all(analysers.map((x) => x()));

    const treeEntropy = fileTree.recomputeTreeEntropy();

    console.log(`project entropy calculated: ${treeEntropy}`);
    return treeEntropy;
};
