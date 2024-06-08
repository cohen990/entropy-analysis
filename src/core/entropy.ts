export const computeEntropy = (input: number) => {
    return naturalLog(factorial(input));
};

const naturalLog: (input: bigint) => number = (input) => {
    if (input < 0) return NaN;

    const inputAsString = input.toString(16);
    const fifteenSignificantFigures = inputAsString.substring(0, 15);

    return (
        Math.log(16) *
            (inputAsString.length - fifteenSignificantFigures.length) +
        Math.log(("0x" + fifteenSignificantFigures) as any)
    );
};
const factorial: (number: number) => bigint = (number) => {
    var result = BigInt(1);
    for (var i = 2; i <= number; i++) {
        result = result * BigInt(i);
    }
    return result;
};
