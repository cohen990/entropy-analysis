import { discoverFiles } from "./discoverFiles"
import { extract } from "./compiler"
import glob from "glob"
import { minimatch } from "minimatch"

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

it("should discover files", () => {
    const path = process.cwd()
    const files = discoverFiles(path)
    console.log(files)
    expect(files.length).toBeGreaterThan(0)
    expect(files.map(x => x.startsWith(path)).reduce((x, y) => x && y, true)).toBe(true)
    expect(files.map(x => x.endsWith(".ts")).reduce((x, y) => x && y, true)).toBe(true)
})

it("should exclude files matching the exclude patterns", () => {
    const path = process.cwd()
    const exclude = "**/tests/**"
    const exclude2 = "**/src/**"
    const files = discoverFiles(path, exclude, exclude2)
    const result = minimatch.match(files, exclude)
    const result2 = minimatch.match(files, exclude2)
    expect(result.length).toBe(0)
    expect(result2.length).toBe(0)
})