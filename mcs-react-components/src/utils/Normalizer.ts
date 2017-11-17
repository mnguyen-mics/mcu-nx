/**
 * Normalize an array of object like the following :
 *
 * In this example, key = 'id'
 * [{id:"x", other: "some value"},{id:"y", other: "some value"}]
 *
 * TO
 *
 * {
 *  x: {id:"x", other: "some value"}
 *  x: {id:"y", other: "some value"}
 * }
 * @param {*} arr input array of object to convert
 * @param {*} key object key to extract
 */

export type Index<T>= { [key:string]: T}

export function normalizeArrayOfObject<T, K extends keyof T>(arr: Array<T>, key: K): Index<T> {
  if (!Array.isArray(arr)) throw new Error(`${arr} is not an array`);
  return arr.reduce((acc, object) => {
      const keyValue = object[key].toString();
      return {
        ...acc,
        [keyValue]: object,
      };
  }, {});
}
