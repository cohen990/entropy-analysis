import { fileHasher, initialiseCache } from "../core/cache";
import { discoverFiles } from "../core/discoverFiles";
import { computeEntropy } from "../core/entropy";
import { sanitiseFileName } from "../core/fileNames";
import { AnalysisParameters, buildFileTree } from "../core/fileTree";
import { bigintDeserialiser, bigintSerialiser } from "../core/serialiser";
import { AnalyseWorkerData, AnalyseWorkerResults } from "../workers/analyse";
import { AnalyseProjectArgs } from "./analyseProjectArgs";
import { Worker } from "worker_threads";

export const analyseProject: (
    args: AnalyseProjectArgs
) => Promise<number> = async ({ owner, repo, exclude, ref }) => {
    const projectKey = sanitiseFileName(`${owner}-${repo}`);
    const analysableKey = sanitiseFileName(`${projectKey}-${ref.slice(0, 7)}`);
    const path = `${process.cwd()}/analysables/${projectKey}/${analysableKey}`;
    const cache = initialiseCache<bigint>(
        projectKey,
        "omega",
        bigintSerialiser,
        bigintDeserialiser
    );

    const files = discoverFiles(path, ...(exclude || []));
    console.log(`discovered ${files.length} files`);

    const fileTree = buildFileTree(path, files);

    const analysisParameters = fileTree.getAnalysisParameters();

    console.log(`about to create ${analysisParameters.length} workers`);

    const promises: Promise<void>[] = analysisParameters.map(async (x) => {
        const omega = await cache.cache(
            analyseWithWorker(x),
            x.fullFilePath.replace(x.rootPath, ""),
            fileHasher(x.fullFilePath)
        );

        const nodePath = `${x.filePath.replace(`${x.rootPath}/`, "")}${
            x.fileName
        }`.split("/");
        fileTree.setFileOmega(nodePath, omega);
    });

    await Promise.all(promises);

    const treeOmega = fileTree.recomputeTreeOmega();

    const treeEntropy = computeEntropy(treeOmega);

    console.log(`project entropy calculated: ${treeEntropy}`);
    return treeEntropy;
};
const analyseWithWorker: (x: AnalysisParameters) => () => Promise<bigint> =
    (x) => () =>
        new Promise((resolve, reject) => {
            const worker = new Worker("./src/workers/analyse.ts", {
                workerData: x as AnalyseWorkerData,
            });
            worker.on("message", (data: AnalyseWorkerResults) => {
                resolve(BigInt(data.omega));
            });
            worker.on("error", reject);
            worker.on("exit", reject);
        });
