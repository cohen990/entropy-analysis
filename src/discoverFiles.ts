import * as glob from "glob";
import { minimatch } from "minimatch";


export const discoverFiles: (path: string, ...filters: string[]) => string[] = (path, ...filters: string[]) => {
    var result = glob.sync(path + '/**/*.ts')
    for (var filter of filters) {
        result = result.filter(x => !minimatch(x, filter))
    }

    return result
};
