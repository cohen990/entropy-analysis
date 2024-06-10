import { sync } from "glob";
import { minimatch } from "minimatch";

export const discoverFiles: (path: string, ...filters: string[]) => string[] = (
    path,
    ...filters: string[]
) => {
    console.log(`searching: ${path}`);
    var result = sync(path + "/**/*.{j,t}s?(x)");
    for (var filter of filters) {
        result = result.filter((x) => !minimatch(x, filter));
    }

    return result;
};
