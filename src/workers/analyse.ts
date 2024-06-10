import { workerData, parentPort } from "worker_threads";
import { extract } from "../core/compiler";

const { fileName: rawFileName, filePath } = workerData as AnalyseWorkerData;

const fileName = rawFileName == "_constructor" ? "constructor" : rawFileName;
const fullFilePath = filePath + fileName;
const omega = extract(fullFilePath).getOmega();

parentPort.postMessage({ fileName, filePath, omega: omega.toString() });

export type AnalyseWorkerData = {
    fileName: string;
    filePath: string;
};

export type AnalyseWorkerResults = AnalyseWorkerData & {
    omega: string;
};
