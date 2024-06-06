import { parse } from "ts-command-line-args";
import { extract } from "./compiler";
import { computeEntropy } from "./entropy";


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

const bigIntScientificNotationFormat: BigIntToLocaleStringOptions = {
  notation: "scientific",
  maximumFractionDigits: 3,
};

(async () => {
  console.log("reading file");
  const file = `${process.cwd()}/analysables/${args.owner}-${args.repo}/${args.path}`

  console.log(`analysing ${file}`);
  const elements = extract(file);
  console.log(`found ${elements} elements in the ast`);

  const entropy = computeEntropy(elements)
  console.log(`entropy = ${entropy}`);
})();