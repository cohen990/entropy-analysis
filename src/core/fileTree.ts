import { extract } from "./compiler";
import { computeEntropy, factorial } from "./entropy";

export const buildFileTree: (rootPath: string, paths: string[]) => FileNode = (
    rootPath,
    paths
) => {
    const localPaths = paths.map((x) => x.replace(rootPath, ""));

    var root: FileNode;
    const addToRoot: (keys: string[]) => void = (keys) => {
        if (!root) {
            root = new FileNode(rootPath, "");
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
    readonly name: string;
    fileOmega: bigint;
    omega: bigint;
    #children: { [Key: string]: FileNode };

    constructor(path: string, name: string) {
        this.#children = {};
        this.path = path.endsWith("/") ? path : path + "/";
        this.name = name;
    }

    add(keys: string[]) {
        if (keys.length == 0) {
            return;
        }

        if (this.#children[keys[0]] === undefined) {
            this.#children[keys[0]] = new FileNode(
                this.path + this.name,
                keys[0]
            );
        }

        if (this.#children[keys[0]] === undefined) {
            console.error(
                `somehow failed to add the node ${keys[0]} to ${this.name}`
            );
        }

        if (!this.#children[keys[0]].add) {
            console.error(
                `There has been some weirdness. ${JSON.stringify(
                    this.#children[keys[0]]
                )}`
            );
        }

        this.#children[keys[0]].add(keys.slice(1));
    }

    print() {
        Object.values(this.#children).forEach((x) => x.print());
    }

    getFileAnalysers(): (() => Promise<void>)[] {
        const analysers: (() => Promise<void>)[] = Object.values(
            this.#children
        ).flatMap((x) => x.getFileAnalysers());

        analysers.push(() => FileNode.computeFilePermutations(this));
        return analysers;
    }

    isLeaf() {
        return Object.values(this.#children).length == 0;
    }

    static async computeFilePermutations(file: FileNode): Promise<void> {
        if (file.isLeaf()) {
            const entropyTree = await extract(file.path + file.name);
            file.fileOmega = entropyTree.getOmega();
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
