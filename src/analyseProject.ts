import { parse } from "ts-command-line-args";
import { extract } from "./compiler";
import { computeEntropy } from "./entropy";
import { discoverFiles } from "./discoverFiles";
import { sanitiseFileName } from "./fileNames";
import { buildFileTree } from "./fileTree";

interface IArgs {
    owner: string;
    repo: string;
    exclude: string[];
}

export const args = parse<IArgs>({
    owner: { type: String, alias: "o", optional: true },
    repo: { type: String, alias: "r", optional: true },
    exclude: { type: String, alias: "x", optional: true, lazyMultiple: true },
});

(async () => {
    const projectDirectory = sanitiseFileName(`${args.owner}-${args.repo}`);
    const path = `${process.cwd()}/analysables/${projectDirectory}/`;
    const files = discoverFiles(path, ...(args.exclude || []));
    console.log(`discovered ${files.length} typescript files`);

    const fileTree = buildFileTree(path, files);

    const analysers = fileTree.getFileEntropyAnalysers();

    await Promise.all(analysers.map((x) => x()));

    const treeEntropy = fileTree.recomputeTreeEntropy();

    console.log(`project entropy calculated: ${treeEntropy}`);
})();
