import { mkdirSync, readFileSync, existsSync, writeFileSync } from "fs";
import { createHash } from "crypto";
import { Deserialiser, Serialiser, bigintSerialiser } from "./serialiser";

export class AnalysisCache<T> {
    cacheDirectory: string;

    constructor(cacheDirectory: string) {
        this.cacheDirectory = cacheDirectory;
    }

    async cache(
        func: () => Promise<T>,
        type: string,
        key: string,
        serialise: Serialiser<T>,
        deserialise: Deserialiser<T>
    ): Promise<T> {
        const cacheItemPath = `${this.cacheDirectory}/${type}`;
        const cacheItemFilePath = `${cacheItemPath}/${key}`;
        if (!existsSync(cacheItemPath)) {
            mkdirSync(cacheItemPath, { recursive: true });
        }
        if (!existsSync(cacheItemFilePath)) {
            console.log("Caching result");
            const result = await func();
            writeFileSync(cacheItemFilePath, serialise(result), {
                encoding: "utf-8",
            });
            console.log(`Written to ${cacheItemFilePath}`);
            return result;
        } else {
            console.log("Retrieving cached result");
            return deserialise(
                readFileSync(cacheItemFilePath).toString("utf-8")
            );
        }
    }
}

export const initializeOmegaCache: (
    project: string
) => AnalysisCache<bigint> = (project) => {
    const cacheDirectory = `${process.cwd()}/.cache/omega/${project}/`;

    mkdirSync(cacheDirectory, { recursive: true });

    return new AnalysisCache<bigint>(cacheDirectory);
};

export const fileHasher = (fullFilePath: string) => {
    if (!existsSync(fullFilePath)) {
        console.log("file doesn't exist");
    }

    const content = readFileSync(fullFilePath);
    return createHash("sha256").update(content).digest("hex");
};
