import { mkdirSync, existsSync, writeFileSync, appendFileSync } from "fs";

export type Results = {
    owner: string;
    repo: string;
    sizeInBytes: number;
    loc: number;
    filesCount: number;
    entropy: number;
    openIssuesCount: number;
    refSha: string;
    languages: { [key: string]: number };
    primaryLanguage: string;
};

const headers: string =
    "owner, repo, entropy, size (B), entropy per byte, loc, entropy per loc, files, entropy per file, open issues, sha, primaryLanguage, languages\n";

export const writeResults: (results: Results) => void = ({
    owner,
    repo,
    sizeInBytes,
    openIssuesCount,
    refSha,
    languages,
    primaryLanguage,
    loc,
    filesCount,
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

    const csvFriendlyLanguages = JSON.stringify(languages)
        .replace(/\"/g, "")
        .replace(/,/g, "|")
        .replace("{", "")
        .replace("}", "");
    const csvFriendlyRefSha = refSha.slice(0, 8);

    appendFileSync(
        resultsFilePath,
        `${owner}, ${repo}, ${entropy}, ${sizeInBytes}, ${
            entropy / sizeInBytes
        }, ${loc}, ${entropy / loc}, ${filesCount}, ${
            entropy / filesCount
        }, ${openIssuesCount}, ${csvFriendlyRefSha}, ${primaryLanguage}, ${csvFriendlyLanguages}\n`
    );
    console.log("Results written");
};
