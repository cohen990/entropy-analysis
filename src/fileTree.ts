import { extract } from "./compiler";
import { computeEntropy } from "./entropy";

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
    fileEntropy: number;
    entropy: number;
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

        this.#children[keys[0]].add(keys.slice(1));
    }

    print() {
        if (this.isLeaf()) {
            console.log(`${this.path + this.name} - entropy ${this.entropy}`);
        }
        Object.values(this.#children).forEach((x) => x.print());
    }

    getFileEntropyAnalysers(): (() => Promise<void>)[] {
        const analysers: (() => Promise<void>)[] = Object.values(
            this.#children
        ).flatMap((x) => x.getFileEntropyAnalysers());

        analysers.push(() => FileNode.computeFileEntropy(this));
        return analysers;
    }

    isLeaf() {
        return Object.values(this.#children).length == 0;
    }

    static async computeFileEntropy(file: FileNode): Promise<void> {
        if (file.isLeaf()) {
            const entropyTree = await extract(file.path + file.name);
            file.fileEntropy = entropyTree.getEntropy();
        } else {
        }
    }

    recomputeTreeEntropy(): number {
        const localEntropy = this.fileEntropy || 0;
        computeEntropy(Object.values(this.#children).length);
        console.log(`${this.name} has local entropy: ${localEntropy}`);

        if (this.isLeaf()) {
            this.entropy = localEntropy;
        } else {
            this.entropy = Object.values(this.#children).reduce(
                (x, y) => x + y.recomputeTreeEntropy(),
                localEntropy
            );
        }

        return this.entropy;
    }
}
