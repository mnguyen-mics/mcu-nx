export type Index<T> = { [key: string]: T };
export type Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
