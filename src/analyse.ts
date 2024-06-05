import { readFile } from "fs/promises";
import { extract } from "./compiler";

(async () => {
  console.log("reading file");
  const file = `${process.cwd()}/analysables/cohen990-mars-rover-again-a2f1be1/src/main.ts`;
  // const file = `${process.cwd()}/analysables/bendrucker-smallest-d378369/test.js`;

  const elements = extract(file);
  console.log(`found ${elements} elements in the ast`);

  // P(n, r) = n!/(n-r)!
  // for n = r, P(n) = n!/0! = n!
  const configurations = factorial(elements);
  const entropy = Math.log(configurations);
  console.log(`entropy = ${entropy}`);
})();

function factorial(number) {
  var rval = 1;
  for (var i = 2; i <= number; i++) rval = rval * i;
  return rval;
}
