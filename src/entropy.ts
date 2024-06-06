export const computeEntropy = (input: number) => {
  const entropy = natlog(factorial(input));


  return entropy
}

const natlog: (input: bigint) => number = (input) => {
  if (input < 0) return NaN;

  const inputAsString = input.toString(16);
  const fifteenSignificantFigures = inputAsString.substring(0, 15);

  return Math.log(16) * (inputAsString.length - fifteenSignificantFigures.length) + Math.log("0x" + fifteenSignificantFigures as any);
}
const factorial: (number: number) => bigint = (number) => {
  var rval = BigInt(1);
  for (var i = 2; i <= number; i++) rval = rval * BigInt(i);
  return rval;
}