import { DownloadArgs } from "./download";

export interface AnalyseProjectArgs {
    owner: string;
    repo: string;
    exclude: string[];
}

export interface DownloadAndAnalyseProjectArgs extends AnalyseProjectArgs, DownloadArgs {
    maxLoc: number;
}
