import { mkdirSync, existsSync, writeFileSync, appendFileSync } from "fs";

export type Results = {
    owner: string;
    repo: string;
    ref: string;
    size: number;
    loc: number;
    entropy: number;
};

const headers: string = "owner, repo, ref, size, loc, entropy\n";

export const writeResults: (results: Results) => void = ({
    owner,
    repo,
    ref,
    size,
    loc,
    entropy,
}) => {
    console.log("Writing results");
    const outDir = `${process.cwd()}/out`;
    const resultsFilePath = `${outDir}/results.csv`;

    if (!existsSync(outDir)) {
        mkdirSync(outDir);
    }

    if (!existsSync(resultsFilePath)) {
        writeFileSync(resultsFilePath, headers);
    }

    appendFileSync(
        resultsFilePath,
        `${owner}, ${repo}, ${ref}, ${size}, ${loc}, ${entropy}\n`
    );
    console.log("Results written");
};
