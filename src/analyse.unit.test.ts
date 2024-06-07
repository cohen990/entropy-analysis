import { extract } from "./compiler"

it("should analyse", () => {

    const owner = "testing"
    const repo = "sample"
    const path = "src/bare-hello.ts"
    const secondPath = "src/multihello.ts"

    const file = `${process.cwd()}/analysables/${owner}-${repo}/${path}`
    const [_, tree] = extract(file);

    const file2 = `${process.cwd()}/analysables/${owner}-${repo}/${secondPath}`
    const [__, tree2] = extract(file2);

    const treeEntropy = tree.getEntropy()
    const secondTreeEntropy = tree2.getEntropy()
    expect(secondTreeEntropy).toBeGreaterThan(treeEntropy)
})