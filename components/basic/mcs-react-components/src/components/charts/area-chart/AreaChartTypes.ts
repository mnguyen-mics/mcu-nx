export type YKey = { key: string; message: string };
export type XKeyMode = 'DAY' | 'HOUR' | 'DEFAULT';
export type Type = 'area' | 'line';
export type XKey = { key: string; mode: XKeyMode };

export function isTypeofXKey(xkey: XKey | string): xkey is XKey {
  return (xkey as XKey).key !== undefined;
}

export function convertXKeyToString(xKey: XKey | string): string {
  return isTypeofXKey(xKey) ? xKey.key : xKey;
}
