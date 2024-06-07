export const sanitiseFileName: (input: string) => string = (input: string) =>
    input.replace(".", "-").toLowerCase();
