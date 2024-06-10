import { Node, SyntaxKind, SourceFile } from "typescript";
import { computeEntropy, factorial } from "./entropy";

export const EntropyTreeRoot: (sourceFile: SourceFile) => EntropyNode = (
    sourceFile
) => {
    return new EntropyNode(sourceFile, sourceFile);
};

export class EntropyNode {
    #node: Node;
    #omega: bigint;
    #children: EntropyNode[];
    #sourceFile: SourceFile;

    constructor(node: Node, sourceFile: SourceFile) {
        this.#node = node;
        this.#sourceFile = sourceFile;
    }

    syntaxKind(): string {
        return SyntaxKind[this.#node.kind];
    }

    getChildren(): EntropyNode[] {
        if (this.#children === undefined) {
            this.#children = this.#node
                .getChildren(this.#sourceFile)
                .filter((x) => x)
                .map((child) => new EntropyNode(child, this.#sourceFile));
            this.#omega = factorial(this.#children.length);
        }
        return this.#children;
    }

    getOmega(): bigint {
        return this.#children
            .map((child) => child.getOmega())
            .reduce(
                (previousValue, nextValue) => previousValue + nextValue,
                this.#omega
            );
    }
}
