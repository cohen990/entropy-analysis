import { extract } from "./compiler"
import { computeEntropy } from "./entropy"

it("should analyse", () => {

    const owner = "testing"
    const repo = "sample"
    const path = "src/bare-hello.ts"
    const file = `${process.cwd()}/analysables/${owner}-${repo}/${path}`
    const [elements, tree] = extract(file);
    console.log(`found ${elements} elements in the ast`);

    const entropy = computeEntropy(elements)
    console.log(`entropy = ${entropy}`);

    const treeEntropy = tree.getEntropy()
})