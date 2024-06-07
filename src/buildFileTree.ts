export const buildTree: (rootPath: string, paths: string[]) => FileNode = (
    rootPath,
    paths
) => {
    const root = new FileNode();

    for (var path of paths) {
        const local = path.replace(rootPath, "");
        console.log(`adding path to tree: ${local}`);
        const nodeKeys = local.split("/");
        root.add(nodeKeys);
    }
    return root;
};

class FileNode {
    #children: { [Key: string]: FileNode };

    constructor() {
        this.#children = {};
    }

    add(keys: string[]) {
        if (keys.length == 0) {
            return;
        }

        if (this.#children[keys[0]] === undefined) {
            console.log(`Added node for ${keys[0]}`);
            this.#children[keys[0]] = new FileNode();
        }

        this.#children[keys[0]].add(keys.slice(1));
    }
}
