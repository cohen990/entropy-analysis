import { parse } from "ts-command-line-args";
import { extract } from "./compiler";


interface IArgs {
  owner: string;
  repo: string;
  path: string;
}

export const args = parse<IArgs>({
  owner: { type: String, alias: "o", optional: true },
  repo: { type: String, alias: "r", optional: true },
  path: { type: String, alias: "p", optional: true }
});

const bigIntScientificNotationFormat: BigIntToLocaleStringOptions = {
  notation: "scientific",
  maximumFractionDigits: 3,
};

(async () => {
  console.log("reading file");
  // const file = `${process.cwd()}/analysables/cohen990-mars-rover-again-a2f1be1/src/app.ts`;
  // const file = `${process.cwd()}/analysables/bendrucker-smallest-d378369/test.js`;
  const file = `${process.cwd()}/analysables/${args.owner}-${args.repo}/${args.path}`

  console.log(`analysing ${file}`);
  const elements = extract(file);
  console.log(`found ${elements} elements in the ast`);

  // P(n, r) = n!/(n-r)!
  // for n = r, P(n) = n!/0! = n!
  const configurations = factorial(elements);
  console.log(
    `configurations: ${configurations.toLocaleString(
      "en-GB",
      bigIntScientificNotationFormat
    )}`
  );
  const entropy = natlog(configurations);
  console.log(`entropy = ${entropy}`);
})();

function factorial(number): bigint {
  var rval = BigInt(1);
  for (var i = 2; i <= number; i++) rval = rval * BigInt(i);
  return rval;
}

function natlog(bigint) {
  if (bigint < 0) return NaN;

  const s = bigint.toString(16);
  const s15 = s.substring(0, 15);

  return Math.log(16) * (s.length - s15.length) + Math.log("0x" + s15 as any);
}