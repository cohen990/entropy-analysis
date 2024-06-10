import { mkdirSync, readFileSync, existsSync, writeFileSync } from "fs";
import { createHash } from "crypto";
import { Deserialiser, Serialiser, bigintSerialiser } from "./serialiser";

export class AnalysisCache<T> {
    cacheDirectory: string;
    serialise: Serialiser<T>;
    deserialise: Deserialiser<T>;

    constructor(
        cacheDirectory: string,
        serialise: Serialiser<T>,
        deserialise: Deserialiser<T>
    ) {
        this.cacheDirectory = cacheDirectory;
        this.serialise = serialise;
        this.deserialise = deserialise;
    }

    async cache(func: () => Promise<T>, type: string, key: string): Promise<T> {
        const cacheItemPath = `${this.cacheDirectory}/${type}`;
        const cacheItemFilePath = `${cacheItemPath}/${key}`;
        if (!existsSync(cacheItemPath)) {
            mkdirSync(cacheItemPath, { recursive: true });
        }
        if (!existsSync(cacheItemFilePath)) {
            console.log("Caching result");
            const result = await func();
            writeFileSync(cacheItemFilePath, this.serialise(result), {
                encoding: "utf-8",
            });
            console.log(`Written to ${cacheItemFilePath}`);
            return result;
        } else {
            console.log("Retrieving cached result");
            return this.deserialise(
                readFileSync(cacheItemFilePath).toString("utf-8")
            );
        }
    }
}

export const initialiseCache: <T>(
    project: string,
    cacheType: string,
    serialise: Serialiser<T>,
    deserialise: Deserialiser<T>
) => AnalysisCache<T> = <T>(project, cacheType, serialise, deserialise) => {
    const cacheDirectory = `${process.cwd()}/.cache/${cacheType}/${project}/`;

    mkdirSync(cacheDirectory, { recursive: true });

    return new AnalysisCache<T>(cacheDirectory, serialise, deserialise);
};

export const fileHasher = (fullFilePath: string) => {
    if (!existsSync(fullFilePath)) {
        console.log("file doesn't exist");
    }

    const content = readFileSync(fullFilePath);
    return createHash("sha256").update(content).digest("hex");
};
