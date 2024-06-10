export const bigintSerialiser: (target: bigint) => string = (target) => {
    return target.toString();
};
export const bigintDeserialiser: (raw: string) => bigint = (raw) => {
    return BigInt(raw);
};

export type Serialiser<T> = (target: T) => string;
export type Deserialiser<T> = (raw: string) => T;
