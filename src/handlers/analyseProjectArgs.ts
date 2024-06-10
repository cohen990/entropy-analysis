import { DownloadArgs } from "./download";

export interface AnalyseProjectArgs {
    owner: string;
    repo: string;
    ref: string;
    exclude: string[];
}

export interface DownloadAndAnalyseProjectArgs extends DownloadArgs {
    maxLoc: number;
    exclude: string[];
}
