import { sync } from "glob";
import { fileHasher, initialiseCache } from "../core/cache";
import { discoverFiles } from "../core/discoverFiles";
import { computeEntropy } from "../core/entropy";
import { sanitiseFileName } from "../core/fileSystem";
import { FileProperties, buildFileTree } from "../core/fileTree";
import { bigintDeserialiser, bigintSerialiser } from "../core/serialiser";
import { AnalyseWorkerData, AnalyseWorkerResults } from "../workers/analyse";
import { AnalyseProjectArgs } from "./analyseProjectArgs";
import { Worker } from "worker_threads";

export const analyseProject: (
    args: AnalyseProjectArgs
) => Promise<number> = async ({ owner, repo, exclude, ref }) => {
    const projectKey = sanitiseFileName(`${owner}-${repo}`);
    const analysableKey = sanitiseFileName(`${projectKey}-${ref}`);
    const guessedPath = `${process.cwd()}/analysables/${projectKey}/${analysableKey}`;
    const path = sync(guessedPath, { nocase: true })[0];
    console.log(`path: ${path}`);
    const cache = initialiseCache<bigint>(
        projectKey,
        "omega",
        bigintSerialiser,
        bigintDeserialiser
    );

    const files = discoverFiles(path, ...(exclude || []));

    const fileTree = buildFileTree(path, files);

    var fileProperties = fileTree.flattenToProperties();

    var head = 0;
    var batchSize = 10;

    console.log(
        `processing ${fileProperties.length} files in batches of ${batchSize}`
    );

    while (head < fileProperties.length) {
        const batchAnalyses = fileProperties.slice(head, head + batchSize);
        const promises: Promise<void>[] = batchAnalyses.map(async (x) => {
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
        head += batchSize;
        console.log(`${Math.min(head, fileProperties.length)} completed.`);
    }

    const treeOmega = fileTree.recomputeTreeOmega();

    const treeEntropy = computeEntropy(treeOmega);

    console.log(`project entropy calculated: ${treeEntropy}`);
    return treeEntropy;
};
const analyseWithWorker: (x: FileProperties) => () => Promise<bigint> =
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
