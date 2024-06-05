import { Octokit } from "@octokit/rest";
import { Duplex } from "stream";
import unzipper from "unzipper";
import { parse } from "ts-command-line-args";

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

  const path = "./analysables";
  const filename = `${path}/${repo}.zip`;
  //   writeFile(filename, Buffer.from(result.data as ArrayBuffer));
  let stream = new Duplex();
  stream.push(Buffer.from(result.data as ArrayBuffer));
  stream.push(null);
  stream.pipe(unzipper.Extract({ path: `${path}` })).on("close", () => {
    console.log("Files unzipped successfully");
  });
})();
