export const jsonParse = (argument: string) => JSON.parse(argument) as unknown;

jsonParse.unsafe = <T>(argument: string) => JSON.parse(argument) as T;
