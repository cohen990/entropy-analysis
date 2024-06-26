import { sync } from "glob";
import { minimatch } from "minimatch";

export const discoverFiles: (path: string, ...filters: string[]) => string[] = (
    path,
    ...filters: string[]
) => {
    var result = sync(path + "/**/*.{j,t}s");
    for (var filter of filters) {
        result = result.filter((x) => !minimatch(x, filter));
    }

    return result;
};
