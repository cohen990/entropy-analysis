import * as ts from "typescript";
import { EntropyNode, EntropyTreeRoot } from "./entropyTree";

export const extract: (file: string) => EntropyNode = (file) => {
    const compilerOptions: ts.CompilerOptions = {
        allowJs: true,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        target: ts.ScriptTarget.ESNext,
    };
    let program = ts.createProgram([file], compilerOptions);
    const sourceFile = program.getSourceFile(file);

    var nodeCount = 0;

    const entropyTreeRoot = EntropyTreeRoot(sourceFile);

    var nodesToSearch: EntropyNode[] = [entropyTreeRoot];

    var nodesToSearchBuffer: EntropyNode[] = [];

    while (nodesToSearch.length > 0) {
        for (var node of nodesToSearch) {
            if (!node) {
                continue;
            }

            nodeCount++;
            nodesToSearchBuffer.push(...node.getChildren());
        }

        nodesToSearch = [...nodesToSearchBuffer];
        nodesToSearchBuffer = [];
    }

    return entropyTreeRoot;
};
