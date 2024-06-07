import { parse } from "ts-command-line-args";
import { extract } from "./compiler";
import { computeEntropy } from "./entropy";
import { discoverFiles } from "./discoverFiles";
import { countLoc } from "./countLoc";
import { sanitiseFileName } from "./fileNames";


interface IArgs {
  owner: string;
  repo: string;
  exclude: string[];
}

export const args = parse<IArgs>({
  owner: { type: String, alias: "o", optional: true },
  repo: { type: String, alias: "r", optional: true },
  exclude: { type: String, alias: "x", optional: true, lazyMultiple: true }
});

(async () => {
  const projectDirectory = sanitiseFileName(`${args.owner}-${args.repo}`)
  const path = `${process.cwd()}/analysables/${projectDirectory}/`
  const files = discoverFiles(path, ...(args.exclude || []))

  var count = 0
  var total = 0
  for (var file of files) {
    console.log(`Counting loc in file: ${file}`)
    total += countLoc(file);
    count++
  }

  console.log(`counted ${total} lines of code across ${count} files.`)
})();

