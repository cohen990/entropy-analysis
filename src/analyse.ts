import { parse } from "ts-command-line-args";
import { extract } from "./compiler";
import { sanitiseFileName } from "./fileNames";

interface IArgs {
    owner: string;
    repo: string;
    path: string;
}

export const args = parse<IArgs>({
    owner: { type: String, alias: "o", optional: true },
    repo: { type: String, alias: "r", optional: true },
    path: { type: String, alias: "p", optional: true },
});

(async () => {
    console.log("reading file");
    const projectDirectory = sanitiseFileName(`${args.owner}-${args.repo}`);
    const file = `${process.cwd()}/analysables/${projectDirectory}/${
        args.path
    }`;

    console.log(`analysing ${file}`);
    const tree = extract(file);

    const treeEntropy = tree.getEntropy();
    console.log(`tree entropy computed at ${treeEntropy}`);
})();
