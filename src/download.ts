import { Octokit } from "@octokit/rest";
import { parse } from "ts-command-line-args";
import { sanitiseFileName } from "./fileNames";
import { mkdirSync, createWriteStream, existsSync } from "fs";
import { Entry, fromBuffer } from "yauzl";

interface IArgs {
    owner: string;
    repo: string;
    ref: string;
}

export const args = parse<IArgs>({
    owner: { type: String, alias: "o", optional: true },
    repo: { type: String, alias: "r", optional: true },
    ref: { type: String, alias: "f", optional: true },
});

(async () => {
    const octokit = new Octokit();
    const owner = args.owner;
    const repo = args.repo;
    const ref = args.ref;
    const result = await octokit.rest.repos.downloadZipballArchive({
        owner,
        repo,
        ref,
    });

    console.log(result);

    const analysablesRoot = `${process.cwd()}/analysables`;
    const targetDirectory =
        analysablesRoot + "/" + sanitiseFileName(`${owner}-${repo}`);
    if (!existsSync(targetDirectory)) {
        mkdirSync(targetDirectory);
    }

    const buffer = Buffer.from(result.data as ArrayBuffer);

    unzip(buffer, targetDirectory);
})();

const unzip = (buffer: Buffer, path: string) => {
    fromBuffer(buffer, { lazyEntries: true }, function (err, zipfile) {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on("entry", function (entry: Entry) {
            if (/\/$/.test(entry.fileName)) {
                if (!existsSync(path + "/" + entry.fileName)) {
                    mkdirSync(path + "/" + entry.fileName);
                }
                zipfile.readEntry();
            } else {
                const write = createWriteStream(path + "/" + entry.fileName);
                zipfile.openReadStream(entry, function (err, readStream) {
                    if (err) throw err;
                    readStream.on("end", function () {
                        zipfile.readEntry();
                    });
                    readStream.pipe(write);
                });
            }
        });
    });
};
