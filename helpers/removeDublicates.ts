export function removeDublicates<T extends { id: number }>(
  ...arrs: T[][]
): T[] {
  const result: Record<number, T> = {};

  arrs.forEach((arr) => {
    arr.forEach((elem) => {
      if (!result[elem.id]) result[elem.id] = elem;
    });
  });

  return Object.values(result);
}
