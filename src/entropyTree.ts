import { Node, SyntaxKind } from "typescript";

export const EntropyTreeRoot: (node: Node) => EntropyNode = (node: Node) => {
    return new EntropyNode(node)
}

export class EntropyNode {

    #node: Node
    #entropy: number
    #children: EntropyNode[]

    constructor(node: Node) {
        this.#node = node
    }


    syntaxKind(): string {
        return SyntaxKind[this.#node.kind];
    };

    getChildren(): EntropyNode[] {
        if (this.#children === undefined) {
            this.#children = this.#node.getChildren()
                .filter(x => x)
                .map(child => new EntropyNode(child))
            this.#entropy = this.#children.length
            console.log(`Computed entropy for ${this.syntaxKind()} to be ${this.#entropy}`)
        }
        return this.#children
    }
}