const fakeIdSuffix = '_fakeid';

export const generateFakeId = () => {
  return `${Math.random()}${fakeIdSuffix}`;
};

export const isFakeId = id => {
  return `${id}`.endsWith(fakeIdSuffix);
};
