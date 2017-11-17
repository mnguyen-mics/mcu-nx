
export interface Tree<T extends Tree<T>>{
  children? : T[];
}

export function fold<T extends Tree<T>, Acc>(roots: T[], acc: Acc, f: (t: Acc, i: T) => Acc): Acc {

  const toVisit : T[]= roots;

  let current = toVisit.shift();
  let acc1 = acc;

  while(current !== undefined){
    const children: T[] = current.children || [];

    toVisit.push(...children);

    acc1 = f(acc1, current);
    current = toVisit.shift();
  }

  return acc1;
}

export function flatten<T extends Tree<T>>(firstLevel: T[]) : T[] {
  return fold<T, T[]>(firstLevel.slice(), [],
    (acc, item) => {
      acc.push(item);
      return acc;
    }
  )
}
