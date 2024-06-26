import { Octokit } from "@octokit/rest";
import { sanitiseFileName } from "../core/fileSystem";
import { mkdirSync, createWriteStream, existsSync } from "fs";
import { Entry, fromBuffer } from "yauzl";
import { initialiseCache } from "../core/cache";

export interface DownloadArgs {
    owner: string;
    repo: string;
}

export interface DownloadResult {
    sizeInBytes: number;
    openIssuesCount: number;
    allLanguages: { [key: string]: number };
    primaryLanguage: string;
    refSha: string;
}

export const download: (
    args: DownloadArgs
) => Promise<DownloadResult | undefined> = async ({ owner, repo }) => {
    const project = `${owner}-${repo}`;
    const cache = initialiseCache<DownloadResult>(
        project,
        "download",
        JSON.stringify,
        JSON.parse
    );
    console.log(`Downloading ${project}`);

    const octokit = new Octokit({
        auth: process.env["GITHUB_ACCESS_TOKEN"],
    });

    const repoResponse = await octokit.rest.repos.get({
        owner,
        repo,
    });
    const ref = repoResponse.data.default_branch;

    const commitResponse = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref,
    });

    return await cache.cache(
        async () => {
            const results = await downloadRepo(octokit, owner, repo, ref);
            return {
                ...results,
                openIssuesCount: repoResponse.data.open_issues_count,
                refSha: commitResponse.data.sha.slice(0, 7),
            };
        },
        project,
        commitResponse.data.sha
    );
};

const unzip: (buffer: Buffer, path: string) => Promise<number> = (
    buffer: Buffer,
    path: string
) => {
    return new Promise((resolve) => {
        fromBuffer(buffer, { lazyEntries: true }, function (err, zipfile) {
            var totalBytes = 0;
            if (err) throw err;
            zipfile.readEntry();
            zipfile.on("entry", function (entry: Entry) {
                totalBytes += entry.uncompressedSize;
                if (/\/$/.test(entry.fileName)) {
                    if (!existsSync(path + "/" + entry.fileName)) {
                        mkdirSync(path + "/" + entry.fileName);
                    }
                    zipfile.readEntry();
                } else {
                    const write = createWriteStream(
                        path + "/" + entry.fileName
                    );
                    zipfile.openReadStream(entry, function (err, readStream) {
                        if (err) throw err;
                        readStream.on("end", function () {
                            zipfile.readEntry();
                        });
                        readStream.pipe(write);
                    });
                }
            });
            zipfile.on("end", () => {
                console.log(`Extracted ${totalBytes} of data`);
                resolve(totalBytes);
            });
        });
    });
};

async function downloadRepo(octokit, owner: string, repo: string, ref: string) {
    const languagesResponse = await octokit.rest.repos.listLanguages({
        owner,
        repo,
    });

    const zipResponse = await octokit.rest.repos.downloadZipballArchive({
        owner,
        repo,
        ref,
    });

    const analysablesRoot = `${process.cwd()}/analysables`;

    if (!existsSync(analysablesRoot)) {
        mkdirSync(analysablesRoot);
    }

    const targetDirectory =
        analysablesRoot + "/" + sanitiseFileName(`${owner}-${repo}`);
    if (!existsSync(targetDirectory)) {
        mkdirSync(targetDirectory);
    }

    const buffer = Buffer.from(zipResponse.data as ArrayBuffer);

    const unzipSize = await unzip(buffer, targetDirectory);

    return {
        sizeInBytes: unzipSize,
        allLanguages: languagesResponse.data,
        primaryLanguage: Object.keys(languagesResponse.data)[0],
    };
}
