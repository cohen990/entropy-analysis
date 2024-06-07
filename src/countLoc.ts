import { readFileSync } from "fs"

export function countLoc(file: string): number {
  let content = readFileSync(file).toString("utf-8")
  return content.split("\n").length
}