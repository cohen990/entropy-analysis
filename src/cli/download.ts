import { parse } from "ts-command-line-args";
import { DownloadArgs, download } from "../handlers/download";

export const args = parse<DownloadArgs>({
    owner: { type: String, alias: "o", optional: true },
    repo: { type: String, alias: "r", optional: true },
    ref: { type: String, alias: "f", optional: true },
});

(async () => download(args))();
