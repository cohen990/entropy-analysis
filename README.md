review NOTES.md and HYPOTHESES.md to follow the thinking and experimentation

to run

```
npm i
export GITHUB_AUTH_TOKEN=<your personal auth token - especially for private repos - ensure permissions are correct>
npm run download-and-analyse -- -o <repo owner> -r <repo name>
```

I believe they need to be case sensitive.

# When creating a github personal access token

You can go for a fine grained token
You just need permissions to read repos.
If you go for `Public Repositories (read-only)`, that's good enough.

If you want to go for specific repos or include private repos, you need `Repository.Contents` permissions. Readonly is fine.

If you want to analyse repos within a certain organisation, when creating the key, where it says `Resource owner`, click the drop down and pick the organisation.

# Scripts

## analyse-file

Legacy. Don't use

args:

-   `-o --owner <the repo owner>`
-   `-r --repo <the repo name>`
-   `-f --ref <the branch name or commit - the ref>`
-   `-x --exclude <any glob patterns to exclude>`
-   `-m --maxLoc <number>`

If you want to exclude multiple patterns, use `-x <pattern1> -x <pattern2>`

## npm run analyse-project

args: `-o, -r, -f, -x`

Analyses a project that is already downloaded - expects the project to be in the `./analysables` directory under `./analysables/<owner>-<repo>/<owner>-<repo>-<ref>/`

## npm run count-loc

args: `-o, -r, -f, -x`

counts the lines of code in ts, js, tsx and jsx files in the codebase. Same expectations and `analyse-project`

## npm run download

args: `-o, -r`

downloads the content of the repo found on the main branch. Stores it under `./analysables/<owner>-<repo>/<owner>-<repo>-<ref>/`

## npm run download-and-analyse

args: `-o, -r, -f, -x, -m`

The main way to use this app. Downloads the repo, counts the lines, analyses the project and writes the results to `/out/results.csv`

## npm run clean

Deletes the contents of `./.cache`, `./out`, `./analysables`. No confirmation. Make sure you have your results backed up somewhere :)
