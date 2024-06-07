import * as ts from "typescript";
import { inspect } from "util";
import { EntropyNode, EntropyTreeRoot } from "./entropyTree";

export function extract(file: string): [number, EntropyNode] {
  const compilerOptions: ts.CompilerOptions = {
    allowJs: true,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ESNext,
  }
  let program = ts.createProgram([file], compilerOptions);
  const sourceFile = program.getSourceFile(file);
  debug(`sourceFile: ${sourceFile}`)

  info(`Processing ${sourceFile.text.split("\n").length} lines of code`)

  var nodeCount = 0;

  const entropyTreeRoot = EntropyTreeRoot(sourceFile)

  var nodesToSearch: EntropyNode[] = [entropyTreeRoot];

  var nodesToSearchBuffer: EntropyNode[] = [];

  debug(`starting with ${inspect(nodesToSearch)}`)


  while (nodesToSearch.length > 0) {

    debug(`scanning ${nodesToSearch.length} nodes`);

    for (var node of nodesToSearch) {
      if (!node) {
        continue
      }

      debug(`scanning a ${node.syntaxKind()} node`);

      nodeCount++;

      trace(inspect(node, undefined, 2));

      nodesToSearchBuffer.push(...node.getChildren());
    }

    debug(`found ${nodesToSearchBuffer.length} more nodes`);

    nodesToSearch = [...nodesToSearchBuffer];
    nodesToSearchBuffer = [];
  }

  info(`Discovered a total of ${nodeCount} nodes`)
  return [nodeCount, entropyTreeRoot];
}

const info = (message: string) => {
  // console.log(message);
};

const debug = (message: string) => {
  // console.log(message);
};

const trace = (message: string) => null; //log(message);
