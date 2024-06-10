import { initializeOmegaCache } from "../core/cache";
import { discoverFiles } from "../core/discoverFiles";
import { computeEntropy } from "../core/entropy";
import { sanitiseFileName } from "../core/fileNames";
import { buildFileTree } from "../core/fileTree";
import { AnalyseProjectArgs } from "./analyseProjectArgs";

export const analyseProject: (
    args: AnalyseProjectArgs
) => Promise<number> = async ({ owner, repo, exclude, ref }) => {
    const projectKey = sanitiseFileName(`${owner}-${repo}`);
    const analysableKey = sanitiseFileName(`${projectKey}-${ref.slice(0, 7)}`);
    const path = `${process.cwd()}/analysables/${projectKey}/${analysableKey}`;
    const cache = initializeOmegaCache(projectKey);

    const files = discoverFiles(path, ...(exclude || []));
    console.log(`discovered ${files.length} typescript files`);

    const fileTree = buildFileTree(path, files);

    const analysers = fileTree.getFileAnalysers(cache);

    await Promise.all(analysers.map((x) => x()));

    const treeOmega = fileTree.recomputeTreeOmega();

    const treeEntropy = computeEntropy(treeOmega);

    console.log(`project entropy calculated: ${treeEntropy}`);
    return treeEntropy;
};
