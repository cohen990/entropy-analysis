import { Octokit } from "@octokit/rest";
import { sanitiseFileName } from "../core/fileNames";
import { mkdirSync, createWriteStream, existsSync } from "fs";
import { Entry, fromBuffer } from "yauzl";

export interface DownloadArgs {
    owner: string;
    repo: string;
    ref: string;
}

export const download: (args: DownloadArgs) => Promise<number> = async ({
    owner,
    repo,
    ref,
}) => {
    console.log(`Downloading ${owner}/${repo}#${ref}`);

    const octokit = new Octokit();

    const result = await octokit.rest.repos.downloadZipballArchive({
        owner,
        repo,
        ref,
    });

    if (
        (result.status as any) != 200 ||
        (result.data as ArrayBuffer).byteLength == 0
    ) {
        console.log("Error downloading from github...");
        console.log(result);
        return;
    }

    const analysablesRoot = `${process.cwd()}/analysables`;

    if (!existsSync(analysablesRoot)) {
        mkdirSync(analysablesRoot);
    }

    const targetDirectory =
        analysablesRoot + "/" + sanitiseFileName(`${owner}-${repo}`);
    if (!existsSync(targetDirectory)) {
        mkdirSync(targetDirectory);
    }

    const buffer = Buffer.from(result.data as ArrayBuffer);

    return await unzip(buffer, targetDirectory);
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
