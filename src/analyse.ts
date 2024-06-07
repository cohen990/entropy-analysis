import { parse } from "ts-command-line-args";
import { extract } from "./compiler";
import { computeEntropy } from "./entropy";
import { sanitiseFileName } from "./fileNames";


interface IArgs {
  owner: string;
  repo: string;
  path: string;
}

export const args = parse<IArgs>({
  owner: { type: String, alias: "o", optional: true },
  repo: { type: String, alias: "r", optional: true },
  path: { type: String, alias: "p", optional: true }
});

(async () => {
  console.log("reading file");
  const projectDirectory = sanitiseFileName(`${args.owner}-${args.repo}`)
  const file = `${process.cwd()}/analysables/${projectDirectory}/${args.path}`

  console.log(`analysing ${file}`);
  const [elements, tree] = extract(file);
  console.log(`found ${elements} elements in the ast`);

  const entropy = computeEntropy(elements)
  console.log(`entropy = ${entropy}`);

  const treeEntropy = tree.getEntropy()
  console.log(`tree entropy computed at ${treeEntropy}`);
})();