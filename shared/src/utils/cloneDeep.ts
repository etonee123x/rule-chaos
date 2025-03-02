export const cloneDeep = <T>(original: T): T => JSON.parse(JSON.stringify(original));
