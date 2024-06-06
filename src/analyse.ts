import { extract } from "./compiler";

const bigIntScientificNotationFormat: BigIntToLocaleStringOptions = {
  notation: "scientific",
  maximumFractionDigits: 3,
};

(async () => {
  console.log("reading file");
  // const file = `${process.cwd()}/analysables/cohen990-mars-rover-again-a2f1be1/src/app.ts`;
  // const file = `${process.cwd()}/analysables/bendrucker-smallest-d378369/test.js`;
  const file = `${process.cwd()}/analysables/microsoft-TypeScript-f5238c3/src/testRunner/unittests/moduleResolution.ts`;

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
  const entropy = naturalLog(configurations);
  console.log(`entropy = ${entropy}`);
})();

function factorial(number): bigint {
  var rval = BigInt(1);
  for (var i = 2; i <= number; i++) rval = rval * BigInt(i);
  return rval;
}

function naturalLog(bigInt: bigint) {
  const log10Of = log10(bigInt);
  console.log(log10Of);
  return log10Of / Math.log10(Math.E);
}

function log10(bigint: bigint) {
  if (bigint < 0) return NaN;
  const s = bigint.toString(10);

  return s.length + Math.log10(Number.parseInt("0." + s.substring(0, 15)));
}
