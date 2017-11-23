const s4 = (): string =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

export default function generateGuid(): string {
  return s4() + s4();
}
