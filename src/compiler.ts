import * as ts from "typescript";
import { inspect } from "util";

/**
 * Prints out particular nodes from a source file
 *
 * @param file a path to a file
 * @param identifiers top level identifiers available
 */
export function extract(file: string): number {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  let program = ts.createProgram([file], { allowJs: true });
  const sourceFile = program.getSourceFile(file);

  var nodeCount = 0;
  var nodesToSearch: ts.Node[] = [sourceFile];
  var nodesToSearchBuffer: ts.Node[] = [];

  while (nodesToSearch.length > 0) {
    log(`scanning ${nodesToSearch.length} nodes`);
    for (var node of nodesToSearch) {
      log(`scanning a ${kindOf(node)} node`);
      nodeCount++;
      // node.getChildren().forEach((child) => {
      // ts.forEachChild(node, (child) => {
      log(`scanning a ${kindOf(node)} under the ${kindOf(node)}`);
      megalog(inspect(node, undefined, 2));
      nodesToSearchBuffer.push(...node.getChildren(sourceFile));
      // });
    }
    log(`found ${nodesToSearchBuffer.length} more nodes`);
    nodesToSearch = [...nodesToSearchBuffer];
    nodesToSearchBuffer = [];
  }

  return nodeCount;
}

const log = (message: string) => {
  return;
  console.log(message);
};

const megalog = (message: string) => null; //log(message);

const kindOf: (node: ts.Node) => string = (node: ts.Node) => {
  return ts.SyntaxKind[node.kind];
};
