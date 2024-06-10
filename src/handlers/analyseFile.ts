import { extract } from "../core/compiler";
import { sanitiseFileName } from "../core/fileSystem";

export interface AnalyseFileArgs {
    owner: string;
    repo: string;
    path: string;
}

export const analyseFile: (args: AnalyseFileArgs) => Promise<void> = async ({
    owner,
    repo,
    path,
}) => {
    console.log("reading file");
    const projectDirectory = sanitiseFileName(`${owner}-${repo}`);
    const file = `${process.cwd()}/analysables/${projectDirectory}/${path}`;

    console.log(`analysing ${file}`);
    const tree = extract(file);

    const treeEntropy = tree.getOmega();
    console.log(`tree entropy computed at ${treeEntropy}`);
};
