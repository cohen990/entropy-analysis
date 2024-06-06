import { Octokit } from "@octokit/rest";
import { Duplex } from "stream";
import unzipper from "unzipper";
import { parse } from "ts-command-line-args";
import { renameSync, rmSync } from "fs"

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
  //   const owner = "bendrucker";
  //   const repo = "smallest";
  //   const ref = "master";
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
  const targetDirectory = `${analysablesRoot}/${owner}-${repo}`
  var done = false;
  let stream = new Duplex();
  stream.push(Buffer.from(result.data as ArrayBuffer));
  stream.push(null);
  let stream2 = new Duplex();
  stream2.push(Buffer.from(result.data as ArrayBuffer));
  stream2.push(null);
  stream.pipe(unzipper.Extract({ path: analysablesRoot }))
    .on("close", () => {
      console.log("Files unzipped successfully");
      stream2.pipe(unzipper.Parse({ path: analysablesRoot }))
        .on("entry", (entry) => {
          if (done) return;
          const directoryName = entry.path.substring(0, entry.path.length)
          const directory = `${analysablesRoot}/${directoryName}`;
          rmSync(targetDirectory, { recursive: true, force: true })
          renameSync(directory, targetDirectory)
          done = true;
        })
    })
})();
