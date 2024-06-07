import { Node, SyntaxKind, SourceFile } from "typescript";
import { computeEntropy } from "./entropy";

export const EntropyTreeRoot: (sourceFile: SourceFile) => EntropyNode = (sourceFile) => {
    return new EntropyNode(sourceFile, sourceFile)
}

export class EntropyNode {

    #node: Node
    #entropy: number
    #children: EntropyNode[]
    #sourceFile: SourceFile

    constructor(node: Node, sourceFile: SourceFile) {
        this.#node = node
        this.#sourceFile = sourceFile
    }


    syntaxKind(): string {
        return SyntaxKind[this.#node.kind];
    };

    getChildren(): EntropyNode[] {
        if (this.#children === undefined) {
            this.#children = this.#node.getChildren(this.#sourceFile)
                .filter(x => x)
                .map(child => new EntropyNode(child, this.#sourceFile))
            this.#entropy = computeEntropy(this.#children.length)
            if (this.#entropy > 0) {
                console.log(`Computed container entropy for ${this.syntaxKind()} to be ${this.#entropy}`)
            }
        }
        return this.#children
    }

    getEntropy(): number {
        const entropy = this.#entropy;
        return entropy +
            this.#children.map(child => child.getEntropy()).reduce((previousValue, nextValue) => previousValue + nextValue, 0)
    }
}