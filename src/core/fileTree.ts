import { AnalysisCache, fileHasher } from "./cache";
import { extract } from "./compiler";
import { factorial } from "./entropy";
import { bigintDeserialiser, bigintSerialiser } from "./serialiser";

export const buildFileTree: (rootPath: string, paths: string[]) => FileNode = (
    rootPath,
    paths
) => {
    const localPaths = paths.map((x) => x.replace(rootPath, ""));

    var root: FileNode;
    const addToRoot: (keys: string[]) => void = (keys) => {
        if (!root) {
            root = new FileNode(rootPath, rootPath, "");
        }
        root.add(keys);
    };

    for (var path of localPaths) {
        const nodeKeys = path.split("/");
        addToRoot(nodeKeys);
    }

    return root;
};

class FileNode {
    readonly path: string;
    readonly rootPath: string;
    readonly name: string;
    fileOmega: bigint;
    omega: bigint;
    #children: { [Key: string]: FileNode };

    constructor(path: string, rootPath: string, name: string) {
        this.#children = {};
        this.path = path.endsWith("/") ? path : path + "/";
        this.rootPath = rootPath;
        this.name = name;
    }

    add(keys: string[]) {
        if (keys.length == 0) {
            return;
        }

        if (keys[0] == "constructor") {
            keys[0] = "_constructor";
        }

        if (this.#children[keys[0]] === undefined) {
            this.#children[keys[0]] = new FileNode(
                this.path + this.name,
                this.rootPath,
                keys[0]
            );
        }

        this.#children[keys[0]].add(keys.slice(1));
    }

    print() {
        Object.values(this.#children).forEach((x) => x.print());
    }

    getFileAnalysers(cache: AnalysisCache<bigint>): (() => Promise<void>)[] {
        const analysers: (() => Promise<void>)[] = Object.values(
            this.#children
        ).flatMap((x) => x.getFileAnalysers(cache));

        analysers.push(() => FileNode.computeFilePermutations(this, cache));
        return analysers;
    }

    isLeaf() {
        return Object.values(this.#children).length == 0;
    }

    static async computeFilePermutations(
        file: FileNode,
        cache: AnalysisCache<bigint>
    ): Promise<void> {
        if (file.isLeaf()) {
            const fileName =
                file.name == "_constructor" ? "constructor" : file.name;
            const fullFilePath = file.path + fileName;
            file.fileOmega = await cache.cache(
                async () => {
                    const tree = await extract(fullFilePath);
                    return tree.getOmega();
                },
                fullFilePath.replace(file.rootPath, ""),
                fileHasher(fullFilePath),
                bigintSerialiser,
                bigintDeserialiser
            );
        } else {
        }
    }

    recomputeTreeOmega(): bigint {
        const localOmega =
            (this.fileOmega || BigInt(0)) +
            factorial(Object.values(this.#children).length);

        if (this.isLeaf()) {
            this.omega = localOmega;
        } else {
            this.omega = Object.values(this.#children).reduce(
                (x, y) => x + y.recomputeTreeOmega(),
                localOmega
            );
        }

        return this.omega;
    }
}
