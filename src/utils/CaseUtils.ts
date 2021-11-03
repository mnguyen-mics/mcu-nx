import _ from 'lodash';
export function keysToCamel(obj: any): any {
  if (_.isPlainObject(obj)) {
    const n: any = {};
    Object.keys(obj).forEach(k => (n[_.camelCase(k)] = keysToCamel(obj[k])));
    return n;
  } else if (_.isArray(obj)) obj.map(i => keysToCamel(i));
  return obj;
}
